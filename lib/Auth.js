// MIT License
//
// Copyright 2018 Electric Imp
//
// SPDX-License-Identifier: MIT
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
// OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

'use strict';

const Util = require('util');
const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const UserInteractor = require('./util/UserInteractor');
const Errors = require('./util/Errors');
const AuthConfig = require('./util/AuthConfig');
const Account = require('./Account');

// auth login/logout commands implementation.
class Auth {
    constructor(options, isInfo = false) {
        options = options || {};
        const location = isInfo ?
            AuthConfig.LOCATION.ANY :
            (options.local ? AuthConfig.LOCATION.LOCAL : AuthConfig.LOCATION.GLOBAL);
        this._helper = ImpCentralApiHelper.getEntity(options.endpoint, location);
        if (options.debug) {
            this._helper.debug = true;
        }
    }

    // Initializes imp-central-api library using identifier/password pair or loginKey
    // depending on the options.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _login(options) {
        if (options.user && options.password !== undefined) {
            return this._helper.login(options.user, options.password);
        }
        else if (options.loginKey) {
            return this._helper.getAccessToken(options.loginKey);
        }
        return Promise.reject(new Errors.InternalLibraryError());
    }

    // 'auth login' command implementation.
    // Creates/rewrites global or local Auth Config.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Nothing
    login(options) {
        const authConfig = this._helper.authConfig;
        return UserInteractor.processCancelContinueChoice(
            Util.format(UserInteractor.MESSAGES.AUTH_FILE_EXISTS, authConfig.location),
            this._login.bind(this),
            options,
            !authConfig.exists() || options.confirmed).
            then(result => {
                authConfig.clean();
                authConfig.endpoint = options.endpoint;
                authConfig.loginKey = options.loginKey;
                authConfig.setAccessToken(result.access_token, result.expires_at);
                if (result.refresh_token) {
                    authConfig.refreshToken = result.refresh_token;
                }
                return authConfig.save(options.temp);
            }).
            then(() => UserInteractor.printMessageWithStatus(UserInteractor.MESSAGES.LOGIN_SUCCESSFUL, authConfig.location)).
            catch(error => UserInteractor.processError(error));
    }

    // 'auth logout' command implementation.
    // Deletes global or local Auth Config.
    //
    // Returns:                 Nothing
    logout() {
        this._logout().
            then(() => UserInteractor.printMessageWithStatus(UserInteractor.MESSAGES.LOGOUT_SUCCESSFUL, this._helper.authConfig.location)).
            catch(error => UserInteractor.processError(error));
    }

    _logout() {
        const authConfig = this._helper.authConfig;
        if (authConfig.exists()) {
            return authConfig.delete();
        }
        else {
            return Promise.reject(new Errors.NoConfigError(authConfig, true));
        }        
    }

    _displayInfo(info) {
        UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_INFO, 'Auth');
        UserInteractor.printJsonData(info);
    }

    _info() {
        const authConfig = this._helper.authConfig;
        return authConfig.checkConfig().
            then(() => {
                const canRefreshToken = authConfig.canRefreshToken();
                const info = {
                    'impCentral API endpoint' : this._helper.apiEndpoint,
                    'Auth file' : authConfig.location,
                    'Access token auto refresh' : canRefreshToken
                };
                let expiresIn = 0;
                if (canRefreshToken) {
                    info['Login method'] = (authConfig.loginKey ? 'Login Key' : 'User/Password');
                }
                else {
                    expiresIn = new Date(authConfig.expiresAt).getTime() - new Date().getTime();
                    info['Access token'] = expiresIn < 0 ? 
                        'expired' :
                        Util.format('expires in %d minutes', Math.trunc(expiresIn / 1000 / 60));
                }
                const checker = expiresIn < 0 ?
                    Promise.resolve(null) :
                    new Account().initById('me').getEntity();
                return checker.
                    then((account) => {
                        if (account) {
                            info['Username'] = account.username;
                            info['Email'] = account.email;
                            info['Account id'] = account.id;
                        }
                        this._displayInfo(info);
                    }).
                    catch(error => {
                        this._displayInfo(info);
                        throw error;
                    });
            });
    }

    // 'auth info' command implementation.
    // Displays the status and the details of the tool authentication.
    //
    // Returns:                 Nothing
    info() {
        this._info().
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }
}

module.exports = Auth;
