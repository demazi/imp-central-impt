# impt Commands Manual

List Of Commands:

**[impt auth info](#auth-info)**  
**[impt auth login](#auth-login)**  
**[impt auth logout](#auth-logout)**  

**[impt build cleanup](#build-cleanup)**  
**[impt build copy](#build-copy)**  
**[impt build delete](#build-delete)**  
**[impt build deploy](#build-deploy)**  
**[impt build get](#build-get)**  
**[impt build info](#build-info)**  
**[impt build list](#build-list)**  
**[impt build run](#build-run)**  
**[impt build update](#build-update)**  

**[impt device assign](#device-assign)**  
**[impt device info](#device-info)**  
**[impt device list](#device-list)**  
**[impt device remove](#device-remove)**  
**[impt device restart](#device-restart)**  
**[impt device unassign](#device-unassign)**  
**[impt device update](#device-update)**  

**[impt dg builds](#device-group-builds)**  
**[impt dg create](#device-group-create)**  
**[impt dg delete](#device-group-delete)**  
**[impt dg info](#device-group-info)**  
**[impt dg list](#device-group-list)**  
**[impt dg reassign](#device-group-reassign)**  
**[impt dg restart](#device-group-restart)**  
**[impt dg unassign](#device-group-unassign)**  
**[impt dg update](#device-group-update)**  

**[impt log get](#log-get)**  
**[impt log stream](#log-stream)**  

**[impt loginkey create](#login-key-create)**  
**[impt loginkey delete](#login-key-delete)**  
**[impt loginkey info](#login-key-info)**  
**[impt loginkey list](#login-key-list)**  
**[impt loginkey update](#login-key-update)**  

**[impt product create](#product-create)**  
**[impt product delete](#product-delete)**  
**[impt product info](#product-info)**  
**[impt product list](#product-list)**  
**[impt product update](#product-update)**  

**[impt project create](#project-create)**  
**[impt project delete](#project-delete)**  
**[impt project info](#project-info)**  
**[impt project link](#project-link)**  
**[impt project update](#project-update)**  

**[impt test create](#test-create)**  
**[impt test delete](#test-delete)**  
**[impt test github](#test-github)**  
**[impt test info](#test-info)**  
**[impt test run](#test-run)**  
**[impt test update](#test-update)**  

**[impt webhook create](#webhook-create)**  
**[impt webhook delete](#webhook-delete)**  
**[impt webhook info](#webhook-info)**  
**[impt webhook list](#webhook-list)**  
**[impt webhook update](#webhook-update)**  

General Info:
- [Command Syntax](#command-syntax)
- [Help Option](#help-option)
- [Entity Identification](#entity-identification)
- [Device Group Type](#device-group-type)
- [Auth File](#auth-file)
- [Project File](#project-file)
- [Test Configuration File](#test-configuration-file)
- [List of Aliases](#list-of-aliases)
- [Common Filter Options](#common-filter-options)

### Command Syntax

**impt <command_group> <command_name> \[\<options>]**, where:
- **<command_group>** - a logical group of commands.
- **<command_name>** - a command name, unique inside the group.
- **\<options>** - one or more options applicable to a corresponded command. Most of commands has them. Options may be written in any order.

One **option** has the following format:
  
**--<option_name> [<option_value>]** or **-<option_alias> [<option_value>]**, where:
- **<option_name>** - is unique across a particular command. For a user convenience many of the option names are reused across different commands.
- **<option_alias>** - a one letter alias for the option. Unique across all option aliases for a particular command. The same option name in different commands always has the same alias.
- **<option_value>** - a value of the option. Not all options require value. If option value has spaces or is empty it must be put into double quotes (“”).

All commands and options are case sensitive.

### Help Option

**--help** option (**-h** option alias) can be used with a fully or a partially specified command:
- **impt --help** - Displays the list of all groups of the commands.
- **impt <command_group> --help** - Displays the list of all commands of the group.
- **impt <command_group> <command_name> --help** - Displays the detailed description of the command.

### Entity Identification

Applicable to impCentral API entities: Account, Product, Device Group, Device, Build (Deployment).

**The rules** how the tool searches an entity:
- There is an order of attributes for every entity type (see below).
- The tool starts from the first attribute in the order and searches the specified value for this attribute.
- If no entity is found for this attribute, the tool searches the specified value for the next attribute in the order.
- If at least one entity is found for the particular attribute, the search is stopped.
- If no entity is found for all attributes or more than one entity is found, then, depending on a particular command, that may be considered as a success (for all *list* commands) or as a fail (for all other commands).

#### Account Identifier
Option: **--owner <ACCOUNT_IDENTIFIER>**

Attributes accepted as <ACCOUNT_IDENTIFIER> (in order of search):
- "*me*" (a predefined word, means the current logged-in account)
- Account Id (always unique)
- Email (always unique)
- Username (always unique)

#### Product Identifier
Option: **--product <PRODUCT_IDENTIFIER>**

Attributes accepted as <PRODUCT_IDENTIFIER> (in order of search):
- Product Id (always unique)
- Product Name (unique among all Products owned by a particular user)

#### Device Group Identifier
Option: **--dg <DEVICE_GROUP_IDENTIFIER>**

Attributes accepted as <DEVICE_GROUP_IDENTIFIER> (in order of search):
- Device Group Id (always unique)
- Device Group Name (unique among all Device Groups in a Product)

#### Device Identifier
Option: **--device <DEVICE_IDENTIFIER>**

Attributes accepted as <DEVICE_IDENTIFIER> (in order of search):
- Device Id (always unique)
- MAC address
- IMP Agent Id
- Device Name

#### Build Identifier
Option: **--build <BUILD_IDENTIFIER>**

Attributes accepted as <BUILD_IDENTIFIER> (in order of search):
- Deployment Id (always unique)
- sha
- tag
- origin

### Device Group Type

The tool commands accept the following constants to specify a type of Device Group:
- *development* - for impCentral API "development_devicegroup" type
- *pre-factory* - for impCentral API "pre_factoryfixture_devicegroup" type
- *pre-production* - for impCentral API "pre_production_devicegroup" type
- *factory* - for impCentral API "factoryfixture_devicegroup" type
- *production* - for impCentral API "production_devicegroup" type

### Auth File

Auth File is *.impt.auth* file. It stores authentication and other information necessary to execute the tool commands. There are two types of Auth File - local and global. The both types have identical format and store similar information.

#### Local Auth File

Local Auth File is Auth File located in the directory from where a tool command is called. Different directories may contain different Local Auth Files. One directory may contain not more than one Local Auth File.

Any command called from a directory where Local Auth File exists is executed in the context (with authentication and other settings) defined by that Local Auth File.
If the current directory does not contain Local Auth File, the command is executed in the context defined by [Global Auth File](#global-auth-file).

#### Global Auth File

Global Auth File affects the tool commands which are called from a directory where [Local Auth File](#local-auth-file) does not exist. There may be not more than one Global Auth File per the tool installation. It is located in the tool specific place.

Any command called from a directory where [Local Auth File](#local-auth-file) does not exist is executed in the context (with authentication and other settings) defined by the Global Auth File. If the both Local Auth File and Global Auth File do not exist, the command fails.

### Project File

Project File is *.impt.project* file located in a directory. Different directories may contain different Project Files. One directory may contain not more than one Project File.

Project File contains settings for a project - an entity which links the source files in the current directory with a concrete Device Group.
Project File references the linked Device Group (of the [types](#device-group-type) *development* or *pre-factory* only) and, correspondingly, the Product which contains that Device Group, Devices assigned to the Device Group, Deployments created for that Device Group, etc.

Project File may affect commands called from the directory where the file is located. Product, Device Group, Devices, Deployment, source files referenced by Project File may be assumed by a command when they are not specified explicitly.

### Test Configuration File

Test Configuration File is *.impt.test* file located in a directory. Different directories may contain different Test Configuration Files. One directory may contain not more than one Test Configuration File.

Test Configuration File contains settings to run unit tests that are created with the [*impUnit*](https://github.com/electricimp/impUnit) test framework.

Test Configuration File affects [Test Commands](#test-commands) only.

## Commands Description

In alphabetical order.

### Authentication Commands

#### Auth Info

**impt auth info \[--debug] \[--help]**

Displays the status and the details of the tool authentication applicable to the current directory. Whether [Local](#local-auth-file) or [Global](#global-auth-file) Auth File is used.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Auth Login

**impt auth login \[--local] \[--endpoint <endpoint_url>] (--user <user_id> --pwd \<password> | --lk <login_key_id>) \[--temp] \[--confirmed] \[--debug] \[--help]**

Global or local login.

Creates [Global](#global-auth-file) or [Local](#local-auth-file) Auth File.

The options for one and only one of the following authentication methods must be specified in the command:
- using an account identifier and password (**--user** and **--pwd** options),
- using a [login key](#login-key-manipulation-commands) (**--lk** option).

User is asked to confirm the operation if the corresponding Auth File already exists (confirmed automatically with **--confirmed** option). If confirmed, the existed Auth File is overwritten.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --local | -l | no | no | If specified, creates/replaces [Local Auth File](#local-auth-file) in the current directory. If not specified, creates/replaces [Global Auth File](#global-auth-file). |
| --endpoint | -e | no | yes | impCentral API endpoint. Default value: https://api.electricimp.com/v5 |
| --user | -u | yes/no | yes | The account identifier: username or email address. If specified, **--pwd** option must be specified as well. |
| --pwd | -w | yes/no | yes | The account password. If specified, **--user** option must be specified as well. |
| --lk | -k | yes/no | yes | The login key id. |
| --temp | -t | no | no | If the option is not specified, the tool saves information required to refresh access token and refreshes it automatically when the token expires. If the option is specified, the tool does not save information required to refresh access token. In this case you need to call **impt auth login** command again after the access token is expired. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Auth Logout

**impt auth logout \[--local] \[--debug] \[--help]**

Global or local logout.

Deletes [Global](#global-auth-file) or [Local](#local-auth-file) Auth File.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --local | -l | no | no | If specified, deletes [Local Auth File](#local-auth-file) (if existed in the current directory). If not specified, deletes [Global Auth File](#global-auth-file) (if existed). |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Build Manipulation Commands

#### Build Cleanup

**impt build cleanup \[--product <PRODUCT_IDENTIFIER>] \[--unflag] \[--confirmed] \[--debug] \[--help]**

Deletes builds (Deployments) which do not have existent relation to any Device Group ("zombie" builds).

If **--product** option is specified, the command deletes Deployments which do not have existent relation to any Device Group but have relation to the specified Product and that Product is not deleted.  
If **--product** option is not specified, the command deletes all Deployments owned by the current logged-in account and which do not have existent relation to any Device Group. This includes Deployments which relate to Products that exist as well as Products that were deleted.

If a Deployment has *"flagged"* attribute set to *true* and **--unflag** option is not specified, this Deployment is excluded from the deletion. If **--unflag** option is specified, such a Deployment is deleted as well.

User is asked to confirm the operation (confirmed automatically with **--confirmed** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --product | -p | no | yes | [Product Identifier](#product-identifier) of the Product. See above. |
| --unflag | -u | no | no | Delete a Deployment even if it has *"flagged"* attribute set to *true*. See above. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Build Copy

**impt build copy \[--build <BUILD_IDENTIFIER>] --dg <DEVICE_GROUP_IDENTIFIER> \[--all] \[--debug] \[--help]**

Copies the specified build (Deployment) to the new Deployment of the specified Device Group.
Fails if the specified Deployment or the specified Device Group does not exist.

The new build for the specified Device Group is created from the IMP device and agent code that the specified original build has. If **--all** option is specified, all other attributes (like Description, origin, flagged, tags) are copied to the new build as well.

The new build is not ran until the Devices are rebooted. To run it call **[impt dg restart](#device-group-restart)** or **[impt device restart](#device-restart)** command.

The source code of the builds is not saved locally. To download the source code from a Deployment - explicitly call [**impt build get**](#build-get) command.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --build | -b | yes/[project](#project-file) | yes | [Build Identifier](#build-identifier) of the Deployment to be copied. If not specified, the most recent Deployment for the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --dg | -g | yes | yes | [Device Group Identifier](#device-group-identifier) of the Device Group the new Deployment is created for. |
| --all | -a | no | no | Copy all attributes of the specified Deployment. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Build Delete

**impt build delete --build <BUILD_IDENTIFIER> \[--force] \[--confirmed] \[--debug] \[--help]**

Deletes the specified build (Deployment).

The command fails if it is the *min_supported_deployment* (see the impCentral APi spec) or a newer Deployment for a Device Group.

Also the command fails if the Deployment has *"flagged"* attribute set to *true* and **--force** option is not specified. Use either **--force** option, or [**impt build update**](#build-update) command to update the attribute.

User is asked to confirm the operation (confirmed automatically with **--confirmed** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --build | -b | yes | yes | [Build Identifier](#build-identifier). |
| --force | -f | no | no | If the Deployment has *"flagged"* attribute set to *true*, set it to *false* to be able to delete the Deployment. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Build Deploy

**impt build deploy \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--device-file <device_file>] \[--agent-file <agent_file>] \[--descr <build_description>] \[--origin \<origin>] \[--tag \<tag>] \[--flagged \[true|false]] \[--debug] \[--help]**

Creates a build (Deployment) from the specified source files, with Description (if specified) and attributes (if
specified) and deploys it to all Devices of the specified Device Group. Fails if the specified Device Group does not exist.

The new build is not run until the Devices are rebooted. To run it call **[impt dg restart](#device-group-restart)** or **[impt device restart](#device-restart)** command.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --device-file | -x | no | yes | Name of a file which contains a source code for IMP device. If not specified, the file referenced by [Project File](#project-file) in the current directory is assumed; if no Project File, empty code is assumed. If the specified file does not exist, empty code is assumed. |
| --agent-file | -y | no | yes | Name of a file which contains a source code for IMP agent. If not specified, the file referenced by [Project File](#project-file) in the current directory is assumed; if no Project File, empty code is assumed. If the specified file does not exist, empty code is assumed. |
| --descr | -s | no | yes | Description of the build (Deployment). |
| --origin | -o | no | yes | A free-form key to store the source of the code. |
| --tag | -t | no | yes | A tag applied to this build (Deployment). This option may be repeated several times to apply several tags. |
| --flagged | -f | no | no | If *true* or no value, this build (Deployment) cannot be deleted without first setting this option back to *false*. If *false* or the option is not specified, the build can be deleted. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Build Get

**impt build get \[--build <BUILD_IDENTIFIER>] \[--device-file <device_file>] \[--agent-file <agent_file>] \[--device-only] \[--agent-only] \[--confirmed] \[--debug] \[--help]**

Downloads the source files of the specified build (Deployment) and displays information about the build.

User is asked to confirm the operation if the files with the specified names already exist in the current directory (confirmed automatically with **--confirmed** option). If confirmed, the existed files are overwritten.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --build | -b | yes/[project](#project-file) | yes | [Build Identifier](#build-identifier). If not specified, the most recent Deployment for the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --device-file | -x | no | yes | Name of a file to where download the source code for IMP device. If not specified, the file referenced by [Project File](#project-file) in the current directory is assumed; if no Project File and **--agent-only** option is not specified, the command fails. |
| --agent-file | -y | no | yes | Name of a file to where download the source code for IMP agent. If not specified, the file referenced by [Project File](#project-file) in the current directory is assumed; if no Project File and **--device-only** option is not specified, the command fails. |
| --device-only | -i | no | yes | Downloads the source code for IMP device only. |
| --agent-only | -j | no | yes | Downloads the source code for IMP agent only. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Build Info

**impt build info \[--build <BUILD_IDENTIFIER>] \[--debug] \[--help]**

Displays information about the specified build (Deployment).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --build | -b | yes/[project](#project-file) | yes | [Build Identifier](#build-identifier). If not specified, the most recent Deployment for the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Build List

**impt build list \[--owner <ACCOUNT_IDENTIFIER>] \[--product <PRODUCT_IDENTIFIER>] \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--dg-type <device_group_type>] \[--sha <deployment_sha>] \[--tag \<tag>] \[--flagged] \[--unflagged] \[--non-zombie] \[--zombie] \[--debug] \[--help]**

Displays information about all builds (Deployments) available to the current logged-in account.

The returned list of the builds may be filtered. Filtering is possible by any combination of the described Filter Options. Every Filter Option may be repeated several times. At first, all Filter Options with the same option name are combined by logical OR. After that, all Filter Options with different option names are combined by logical AND.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |
| Filter Options: | | | | |
| --owner | -o | no | yes | Builds owned by the [specified Account(s)](#account-identifier) only. |
| --product | -p | no | yes | Builds deployed to Device Groups which belong to the [specified Product(s)](#product-identifier) only. |
| --dg | -g | no | yes | Builds deployed to the [specified Device Group(s)](#device-group-identifier) only. |
| --dg-type | -y | no | yes | Builds deployed to Device Groups of the [specified type](#device-group-type) only. |
| --sha | -s | no | yes | Builds with the specified *SHA* only. |
| --tag | -t | no | yes | Builds with the specified tag only. |
| --flagged | -f | no | no | Builds with the flagged attribute set to *true* only. |
| --unflagged | -u | no | no | Builds with the flagged attribute set to *false* only. |
| --non-zombie | -n | no | no | Only builds which have existent relation to Device Group. |
| --zombie | -m | no | no | Only builds which do not have existent relation to Device Group. |

#### Build Run

**impt build run \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--device-file <device_file>] \[--agent-file <agent_file>] \[--descr <build_description>] \[--origin \<origin>] \[--tag \<tag>] \[--flagged \[true|false]] \[--conditional] \[--log] \[--debug] \[--help]**

Creates, deploys and runs a build (Deployment). Optionally, displays logs of the running build. Fails if the specified Device Group does not exist.

It behaves exactly like **[impt build deploy](#build-deploy)** command followed by **[impt dg restart](#device-group-restart)** command and, optionally, by **[impt log stream](#log-stream)** command.

Informs user if the specified Device Group does not have assigned Devices, in this case the Deployment is created anyway.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --device-file | -x | no | yes | Name of a file which contains a source code for IMP device. If not specified, the file referenced by [Project File](#project-file) in the current directory is assumed; if no Project File, empty code is assumed. If the specified file does not exist, empty code is assumed. |
| --agent-file | -y | no | yes | Name of a file which contains a source code for IMP agent. If not specified, the file referenced by [Project File](#project-file) in the current directory is assumed; if no Project File, empty code is assumed. If the specified file does not exist, empty code is assumed. |
| --descr | -s | no | yes | Description of the build (Deployment). |
| --origin | -o | no | yes | A free-form key to store the source of the code. |
| --tag | -t | no | yes | A tag applied to this build (Deployment). This option may be repeated several times to apply several tags. |
| --flagged | -f | no | no | If *true* or no value, this build (Deployment) cannot be deleted without first setting this option back to *false*. If *false* or the option is not specified, the build can be deleted. |
| --conditional | -c | no | no | Conditional restart of Devices assigned to the specified Device Group instead of a normal restart (see the impCentral API spec). |
| --log | -l | no | no | Starts displaying logs from the Devices assigned to the specified Device Group (see **[impt log stream](#log-stream)** command description). To stop displaying the logs press *\<Ctrl-C>*. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Build Update

**impt build update \[--build <BUILD_IDENTIFIER>] \[--descr <build_description>] \[--tag \<tag>] \[--remove-tag \<tag>] \[--flagged \[true|false]] \[--debug] \[--help]**

Updates Description, tags and flagged attribute (whatever specified) of the specified build (Deployment).
Fails if the specified build (Deployment) does not exist.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --build | -b | yes/[project](#project-file) | yes | [Build Identifier](#build-identifier). If not specified, the most recent Deployment for the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --descr | -s | no | yes | Description of the build (Deployment). |
| --tag | -t | no | yes | A tag applied to this build (Deployment). This option may be repeated several times to apply several tags. |
| --remove-tag | -r | no | yes | A tag removed from this build (Deployment). This option may be repeated several times to remove several tags. |
| --flagged | -f | no | no | If *true* or no value, this build (Deployment) cannot be deleted without first setting this attribute back to *false*. If *false*, the build can be deleted. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Device Manipulation Commands

#### Device Assign

**impt device assign --device <DEVICE_IDENTIFIER> \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--confirmed] \[--debug] \[--help]**

Assigns the specified Device to the specified Device Group.
Fails if the specified Device Group does not exist.

User is asked to confirm the operation if the specified Device is already assigned to another Device Group. If the operation is confirmed (confirmed automatically with **--confirmed** option), the Device is reassigned to the new Device Group. 

The operation may fail for some combinations of the Device Group [types](#device-group-type), for some models of IMP devices, for reassigning between the Products, etc.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Info

**impt device info --device <DEVICE_IDENTIFIER> \[--debug] \[--help]**

Displays information about the specified Device.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device List

**impt device list \[--owner <ACCOUNT_IDENTIFIER>] \[--product <PRODUCT_IDENTIFIER>] \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--dg-type <device_group_type>] \[--unassigned] \[--assigned] \[--online] \[--offline] \[--debug] \[--help]**

Displays information about all Devices available to the current logged-in account.

The returned list of the Devices may be filtered. Filtering is possible by any combination of the described Filter Options. Every Filter Option may be repeated several times. At first, all Filter Options with the same option name are combined by logical OR. After that, all Filter Options with different option names are combined by logical AND.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |
| Filter Options: | | | | |
| --owner | -o | no | yes | Devices owned by the [specified Account(s)](#account-identifier) only. |
| --product | -p | no | yes | Devices assigned to Device Groups which belong to the [specified Product(s)](#product-identifier) only. |
| --dg | -g | no | yes | Devices assigned to the [specified Device Group(s)](#device-group-identifier) only. |
| --dg-type | -y | no | yes | Devices assigned to Device Groups of the [specified type](#device-group-type) only. |
| --unassigned | -u | no | no | Unassigned Devices only. |
| --assigned | -a | no | no | Assigned Devices only. |
| --online | -n | no | no | Devices in online state only. |
| --offline | -f | no | no | Devices in offline state only. |

#### Device Remove

**impt device remove --device <DEVICE_IDENTIFIER> \[--force] \[--confirmed] \[--debug] \[--help]**

Removes the specified Device from the logged-in account.

The command fails if the Device is assigned to a Device Group and **--force** option is not specified. Use either **--force** option, or [**impt device unassign**](#device-unassign) command to unassign the Device before removal.

User is asked to confirm the operation (confirmed automatically with **--confirmed** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| --force | -f | no | no | If the Device is assigned to a Device Group, unassign it first to be able to remove. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Restart

**impt device restart --device <DEVICE_IDENTIFIER> \[--conditional] \[--log] \[--debug] \[--help]**

Reboots the specified Device and, optionally, starts displaying logs from it.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| --conditional | -c | no | no | Conditional restart (see the impCentral API spec). |
| --log | -l | no | no | Starts displaying logs from the specified Device (see **[impt log stream](#log-stream)** command description). To stop displaying the logs press *\<Ctrl-C>*. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Unassign

**impt device unassign --device <DEVICE_IDENTIFIER> \[--unbond <unbond_key>] \[--debug] \[--help]**

Unassigns the specified Device.
Does nothing if the Device already unassigned.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| --unbond | -u | no | yes | Unbond key is required to unassign Device from Device Group of the [type](#device-group-type) *production*. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Update

**impt device update --device <DEVICE_IDENTIFIER> --name <device_name> \[--debug] \[--help]**

Updates Name of the specified Device.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| --name | -n | yes | yes | New Name of the Device. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Device Group Manipulation Commands

#### Device Group Builds

**impt dg builds \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--unflag] \[--unflag-old] \[--remove] \[--confirmed] \[--debug] \[--help]**

Updates and/or deletes builds (Deployments) of the specified Device Group and displays information about all Deployments of the Device Group at the end of the command execution (as by [**impt build list**](#build-list) command).

User is asked to confirm the operation if any Deployment is going to be deleted (confirmed automatically with **--confirmed** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --unflag | -u | no | no | Set *"flagged"* attribute to *false* in all Deployments of the specified Device Group. |
| --unflag-old | -o | no | no | Set *"flagged"* attribute to *false* in all Deployments of the specified Device Group which are older than *min_supported_deployment* (see the impCentral API spec). |
| --remove | -r | no | no | Deletes all Deployments of the specified Device Group which are older than *min_supported_deployment* (see the impCentral API spec) and have *"flagged"* attribute set to *false*. This option works after **--unflag**/**--unflag-old** options. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group Create

**impt dg create --name <device_group_name> \[--dg-type <device_group_type>] \[--product <PRODUCT_IDENTIFIER>] \[--descr <device_group_description>] \[--target <DEVICE_GROUP_IDENTIFIER>] \[--debug] \[--help]**

Creates a new Device Group for the specified Product.
Fails if Device Group with the specified Name already exists in the specified Product.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --name | -n | yes | yes | Name of the Device Group. Must be unique among all Device Groups in the specified Product. |
| --dg-type | -y | no | yes | [Type](#device-group-type) of the Device Group. If not specified, *development* type is assumed. If the type value is invalid, the command fails. |
| --product | -p | yes/[project](#project-file) | yes | [Product Identifier](#product-identifier) of the Product which the Device Group belongs to. If not specified, the Product referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --descr | -s | no | yes | Description of the Device Group. |
| --target | -t | no | yes | [Device Group Identifier](#device-group-identifier) of the production target Device Group for the being created Device Group. Should be specified for the being created Device Group of the [type](#device-group-type) *factory* or *pre-factory* only. The target Device Group must be of the [type](#device-group-type) *production* or *pre-production* correspondingly and belongs to the specified Product. Otherwise the command fails. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group Delete

**impt dg delete \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--builds] \[--force] \[--confirmed] \[--debug] \[--help]**

Deletes the specified Device Group and, optionally, all the related builds (Deployments).

The command fails if the Device Group is the production target of another Device Group of the [type](#device-group-type) *factory* or *pre-factory*. Use either [**impt dg update**](#device-group-update) command to update the production target of that Device Group, or **impt dg delete** command to delete that Device Group before this one.

Also, the command fails when **--force** option is not specified and:
- there are Devices assigned to this Device Group. Use either **--force** option, or [**impt dg unassign**](#device-group-unassign) / [**impt dg reassign**](#device-group-reassign) commands to unassign the Devices from this Device Group,
- or the Device Group has any Deployments with *"flagged"* attribute set to *true*. Use either **--force** option, or [**impt build update**](#build-update) command to update that attribute.

User is asked to confirm the operation (confirmed automatically with **--confirmed** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --builds | -b | no | no | Additionally deletes all Deployments related to the Device Group. | 
| --force | -f | no | no | Unassigns all Devices of the Device Group, as by [**impt dg unassign**](#device-group-unassign) command. Set *"flagged"* attribute to *false* in all Deployments of the Device Group. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group Info

**impt dg info \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--full] \[--debug] \[--help]**

Displays information about the specified Device Group.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --full | -u | no | no | Displays additional information: details about Devices assigned to the Device Group, about Webhooks created for the Device Group and other. | 
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group List

**impt dg list \[--owner <ACCOUNT_IDENTIFIER>] \[--product <PRODUCT_IDENTIFIER>] \[--dg-type <device_group_type>] \[--debug] \[--help]**

Displays information about all Device Groups available to the current logged-in account.

The returned list of the Device Groups may be filtered. Filtering is possible by any combination of the described Filter Options. Every Filter Option may be repeated several times. At first, all Filter Options with the same option name are combined by logical OR. After that, all Filter Options with different option names are combined by logical AND.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |
| Filter Options: | | | | |
| --owner | -o | no | yes | Device Groups owned by the [specified Account(s)](#account-identifier) only. |
| --product | -p | no | yes | Device Groups which belong to the [specified Product(s)](#product-identifier) only. |
| --dg-type | -y | no | yes | Device Groups of the [specified type](#device-group-type) only. |

#### Device Group Reassign

**impt dg reassign --from <DEVICE_GROUP_IDENTIFIER> \[--to <DEVICE_GROUP_IDENTIFIER>] \[--debug] \[--help]**

Reassigns all Devices from one Device Group to another.
Fails if any of the specified Device Groups does not exist.

The operation may fail for some combinations of the Device Group [types](#device-group-type), for some models of IMP devices, for reassigning between the Products, etc.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --from | -f | yes | yes | [Device Group Identifier](#device-group-identifier) of the origin Device Group. |
| --to | -t | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier) of the destination Device Group. If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group Restart

**impt dg restart \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--conditional] \[--log] \[--debug] \[--help]**

Reboots all Devices assigned to the specified Device Group and, optionally, starts displaying logs from them.
Does nothing if the Device Group has no Devices assigned.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --conditional | -c | no | no | Conditional restart (see the impCentral API spec). |
| --log | -l | no | no | Starts displaying logs from the Devices assigned to the specified Device Group (see **[impt log stream](#log-stream)** command description). To stop displaying the logs press *\<Ctrl-C>*. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group Unassign

**impt dg unassign \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--unbond <unbond_key>] \[--debug] \[--help]**

Unassigns all Devices from the specified Device Group.
Does nothing if the Device Group has no Devices assigned.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --unbond | -u | no | yes | Unbond key is required to unassign Devices from a Device Group of the [type](#device-group-type) *production*. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group Update

**impt dg update \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--name <device_group_name>] \[--descr <device_group_description>] \[--target <DEVICE_GROUP_IDENTIFIER>] \[--load-code-after-blessing \[true|false]] \[--min-supported-deployment <BUILD_IDENTIFIER>] \[--debug] \[--help]**

Updates the specified Device Group.
Fails if the specified Device Group does not exist.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --name | -n | no | yes | New Name of the Device Group. Must be unique among all Device Groups in the Product. |
| --descr | -s | no | yes | Description of the Device Group. |
| --target | -t | no | yes | [Device Group Identifier](#device-group-identifier) of the production target Device Group for the being updated Device Group. May be specified for the being updated Device Group of the [type](#device-group-type) *factory* or *pre-factory* only. The target Device Group must be of the [type](#device-group-type) *production* or *pre-production* correspondingly and belongs to the same Product as the being updated Device Group. Otherwise the command fails. |
| --load-code-after-blessing | -l | no | no | Applicable to Device Group of the [type](#device-group-type) *production* or *pre-production* only. If *true* or no value, production code is immediately loaded by the device after blessing. If *false*, production code will be loaded the next time the device connects as part of BlinkUp, whether successful or not. Note, the newly created production Device Group always has this option *true*. |
| --min-supported-deployment | -m | no | no | [Build Identifier](#build-identifier) of the new *min_supported_deployment* (see the impCentral API spec). The Deployment should belong to this Device Group and should be newer than the current *min_supported_deployment*. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Log Manipulation Commands

#### Log Get

**impt log get \[--device <DEVICE_IDENTIFIER>] \[--page-size <number_of_entries>] \[--page-number <page_number>] \[--debug] \[--help]**

Displays historical logs for the specified Device.
The logs are displayed starting from the most recent one.

Note, a limited number of log entries are kept for a limited period of time.

If **--page-number** option is specified, the command displays the specified page of the log entries and finishes.

If **--page-number** option is not specified, the command displays all saved log entries by pages, starting from the page with the most recent log entries. After every page of log entries is displayed the command is paused:
- to display the next page press *\<Enter>*
- to abort the command execution press *\<Ctrl-C>*

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes/[project](#project-file) | yes | [Device Identifier](#device-identifier). If not specified and there is one and only one Device in the Device Group referenced by [Project File](#project-file) in the current directory, then this Device is assumed (if no Project File or the Device Group has zero or more than one Devices, the command fails). |
| --page-size | -s | no | no | Number of log entries in one page. Default value: 20 |
| --page-number | -n | no | no | Ordinal page number with the log entries to display. Must have a positive value. Page 1 is a page with the most recent log entries. If specified, the command displays this page of the log entries only. If not specified, the command displays all saved log entries. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Log Stream

**impt log stream \[--device <DEVICE_IDENTIFIER>] \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--debug] \[--help]**

Creates a log stream and displays logs from the specified Devices in real-time.

No one command can be called while the logs are being streamed.
To stop displaying the logs press *\<Ctrl-C>*.

Note, one account can have a limited number of log streams at a time. If the limit is reached and a new log stream is created, an existing one is automatically closed.

The command allows to specify several Devices which logs will be added to the newly created log stream. It is also possible to specify one or several Device Groups. Logs from all Devices assigned to the specified Device Groups as well as from directly specified Devices will be displayed in the newly created log stream.

Note, there is a limit to the number of Devices in one log stream. The tool does not check this limit and allow you to specify any number of Devices. Check the operation output to see which Devices are finally added to the log stream.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | no | yes | [Device Identifier](#device-identifier) of the Device which logs will be added to the log stream. This option may be repeated several times to specify several Devices. |
| --dg | -g | no/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). This option may be repeated several times to specify several Device Groups. Logs from all Devices assigned to the specified Device Groups will be added to the log stream. **--device** and **--dg** options are cumulative. If the both **--device** and **--dg** options are not specified but there is [Project File](#project-file) in the current directory, all Devices assigned to the Device Group referenced by the [Project File](#project-file) are assumed. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Login Key Manipulation Commands

#### Login Key Create

**impt loginkey create --pwd \<password> \[--descr <login_key_description>] \[--debug] \[--help]**

Creates a new Login Key for the currently logged-in account.

Note, there is a limit on a total number of Login Keys per one account. Use [**impt loginkey delete**](#login-key-delete) command to delete an existent Login Key.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --pwd | -w | yes | yes | The account password. |
| --descr | -s | no | yes | Description of the Login Key. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Login Key Delete

**impt loginkey delete --lk <login_key_id> --pwd \<password> \[--confirmed] \[--debug] \[--help]**

Deletes the specified Login Key.

User is asked to confirm the operation (confirmed automatically with **--confirmed** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --lk | -k | yes | yes | The login key id. |
| --pwd | -w | yes | yes | The account password. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Login Key Info

**impt loginkey info --lk <login_key_id> \[--debug] \[--help]**

Displays information about the specified Login Key.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --lk | -k | yes | yes | The login key id. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Login Key List

**impt loginkey list \[--debug] \[--help]**

Displays information about all Login Keys of the current logged-in account.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Login Key Update

**impt loginkey update --lk <login_key_id> --pwd \<password> --descr <login_key_description> \[--debug] \[--help]**

Updates the Description of the specified Login Key.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --lk | -k | yes | yes | The login key id. |
| --pwd | -w | yes | yes | The account password. |
| --descr | -s | no | yes | New Description of the Login Key. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Product Manipulation Commands

#### Product Create

**impt product create --name <product_name> \[--descr <product_description>] \[--debug] \[--help]**

Creates a new Product.
Fails if Product with the specified Name already exists.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --name | -n | yes | yes | Name of the Product. Must be unique among all Products owned by the logged-in account. |
| --descr | -s | no | yes | Description of the Product. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Product Delete

**impt product delete \[--product <PRODUCT_IDENTIFIER>] \[--builds] \[--force] \[--confirmed] \[--debug] \[--help]**

Deletes the specified Product.

The command fails if the Product has one or several Device Groups and **--force** option is not specified. Use either **--force** option, or [**impt dg delete**](#device-group-delete) command to delete Device Groups of the Product.

User is asked to confirm the operation (confirmed automatically with **--confirmed** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --product | -p | yes/[project](#project-file) | yes | [Product Identifier](#product-identifier). If not specified, the Product referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --builds | -b | no | no | Additionally deletes all Deployments related to all Device Groups which belong/belonged to the Product, including the Device Groups that were deleted before. | 
| --force | -f | no | no | Deletes all Device Groups of the Product to be able to delete the Product. As by [**impt dg delete --force**](#device-group-delete) command called for every Device Group. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Product Info

**impt product info \[--product <PRODUCT_IDENTIFIER>] \[--full] \[--debug] \[--help]**

Displays information about the specified Product.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --product | -p | yes/[project](#project-file) | yes | [Product Identifier](#product-identifier). If not specified, the Product referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --full | -u | no | no | Displays additional information and the full structure of the Product: Details about every Device Group that belongs to the Product, about Devices assigned to the Device Groups and other. | 
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Product List

**impt product list \[--owner <ACCOUNT_IDENTIFIER>] \[--debug] \[--help]**

Displays information about all Products available to the current logged-in account.

The returned list of the Products may be filtered. Filtering is possible by any combination of the described Filter Options. Every Filter Option may be repeated several times. At first, all Filter Options with the same option name are combined by logical OR. After that, all Filter Options with different option names are combined by logical AND.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |
| Filter Options: | | | | |
| --owner | -o | no | yes | Products owned by the [specified Account(s)](#account-identifier) only. |

#### Product Update

**impt product update \[--product <PRODUCT_IDENTIFIER>] \[--name <product_name>] \[--descr <product_description>] \[--debug] \[--help]**

Updates the specified Product by a new Name and/or Description.
Fails if the specified Product does not exist.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --product | -p | yes/[project](#project-file) | yes | [Product Identifier](#product-identifier). If not specified, the Product referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --name | -n | no | yes | New Name of the Product. Must be unique among all Products owned by a particular Account. |
| --descr | -s | no | yes | Description of the Product. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Project Manipulation Commands

#### Project Create

**impt project create --product <PRODUCT_IDENTIFIER> \[--create-product] --name <device_group_name> \[--descr <device_group_description>] \[--device-file <device_file>] \[--agent-file <agent_file>] \[--create-files] \[--pre-factory] \[--target <DEVICE_GROUP_IDENTIFIER>] \[--create-target] \[--confirmed] \[--debug] \[--help]**

Creates a new Device Group for the specified Product and creates new [Project File](#project-file) in the current directory by linking it to the new Device Group.

The command fails if:
- the specified Product does not exist and **--create-product** option is not specified. Use either **--create-product** option, or [**impt product create**](#product-create) command to create the Product before the Project.
- Device Group with the specified name already exist in the specified Product. Use [**impt project link**](#project-link) command to create the Project linked to that Device Group.
- optionally specified production target Device Group does not exist and **--create-target** option is not specified. Use either **--create-target** option, or [**impt dg create**](#device-group-create) command to create the required Device Group of the [type](#device-group-type) *pre-production*.

User is asked to confirm the operation if the current directory already contains [Project File](#project-file) (confirmed automatically with **--confirmed** option). If confirmed, the existed [Project File](#project-file) is overwritten.

The created Device Group is of the [type](#device-group-type) *development* or *pre-factory* (depends on **--pre-factory** option).

At the end of the command execution information about the project is displayed (as by [**impt project info**](#project-info) command).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --product | -p | yes | yes | [Product Identifier](#product-identifier). |
| --create-product | -i | no | no | If the Product specified by **--product** option does not exist, it is created. In this case, the value of **--product** option is considered as a Name of the new Product. If the Product specified by **--product** option exists, **--create-product** option is ignored. |
| --name | -n | yes | yes | Name of the new Device Group. Must be unique among all Device Groups in the specified Product. |
| --descr | -s | no | yes | Description of the Device Group. |
| --device-file | -x | no | yes | Name of a file for IMP device source code. Default value: *device.nut* |
| --agent-file | -y | no | yes | Name of a file for IMP agent source code. Default value: *agent.nut* |
| --create-files | -c | no | no | Creates empty file(s) if the file(s) referenced by [Project File](#project-file) as the file(s) with IMP device/agent source code do not exist. |
| --pre-factory | -f | no | no | If not specified, the new Device Group is of the [type](#device-group-type) *development*. If specified, the new Device Group is of the [type](#device-group-type) *pre-factory*. |
| --target | -t | no | yes | [Device Group Identifier](#device-group-identifier) of the production target Device Group for the being created Device Group. May be specified if and only if **--pre-factory** option is specified. The specified target Device Group must be of the [type](#device-group-type) *pre-production* and belongs to the specified Product. Otherwise the command fails. |
| --create-target | -j | no | no | If the Device Group specified by **--target** option does not exist, it is created. In this case, the value of **--target** option is considered as a Name of the new Device Group. If **--target** option is not specified or the Device Group specified by **--target** option exists, **--create-target** option is ignored. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Project Delete

**impt project delete \[--entities] \[--files] \[--all] \[--confirmed] \[--debug] \[--help]**

Deletes [Project File](#project-file) in the current directory and, optionally, the impCentral API entities (Device Group, Product, Deployments) related to the project, and, optionally, the local source files.
Does nothing if there is no [Project File](#project-file) in the current directory.

If **--entities** option is specified, the command additionally:
- unassigns all Devices from the project Device Group (Device Group referenced by [Project File](#project-file)).
- deletes the project Device Group.
- deletes all builds (Deployments) of the project Device Group, including Deployments with *"flagged"* attribute set to *true*.
- if the project Device Group has a production target Device Group and that is a production target for one and only one Device Group:
  - unassigns all Devices from the production target Device Group.
  - deletes the production target Device Group.
  - deletes all builds (Deployments) of the production target Device Group, including Deployments with *"flagged"* attribute set to *true*.
- if the corresponding Product (the Product which contains the Device Group referenced by [Project File](#project-file)) includes only the project Device Group and, if applicable, the production target Device Group mentioned above and does not include any other Device Groups:
  - deletes the corresponding Product.

User is informed about all entities and files which are going to be deleted or updated and is asked to confirm the operation (confirmed automatically with **--confirmed** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --entities | -e | no | no | Also deletes the impCentral API entities (Device Group, Product, Deployments) referenced by [Project File](#project-file). See above. |
| --files | -f | no | no | Also deletes the files referenced by [Project File](#project-file) as files with IMP device and agent source code. |
| --all | -a | no | no | Includes **--entities** and **--files** options. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Project Info

**impt project info \[--full] \[--debug] \[--help]**

Displays information about the project.
Fails if there is no [Project File](#project-file) in the current directory.
With every call the latest actual information is obtained using impCentral API.

Informs user if the Device Group referenced by [Project File](#project-file) does not exist. [Project File](#project-file) is not deleted in this case. To delete it - explicitly call [**impt project delete**](#project-delete) command.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --full | -u | no | no | Displays additional information: full details about the corresponding Device Group, like [**impt dg info --full**](#device-group-info) command displays; authentication status applicable to the current directory, like [**impt auth info**](#auth-info) command displays. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Project Link

**impt project link --dg <DEVICE_GROUP_IDENTIFIER> \[--device-file <device_file>] \[--agent-file <agent_file>] \[--create-files] \[--confirmed] \[--debug] \[--help]**

Creates new [Project File](#project-file) in the current directory by linking it to the specified Device Group.

The command fails if:
- the specified Device Group does not exist or is not unique.
- the specified Device Group is not of the [type](#device-group-type) *development* or *pre-factory*.

User is asked to confirm the operation if the current directory already contains [Project File](#project-file) (confirmed automatically with **--confirmed** option). If confirmed, the existed [Project File](#project-file) is overwritten.

The command does not download any Deployment. To download source code from a Deployment - explicitly call [**impt build get**](#build-get) command.

At the end of the command execution information about the project is displayed (as by [**impt project info**](#project-info) command).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes | yes | [Device Group Identifier](#device-group-identifier). |
| --device-file | -x | no | yes | Name of a file for IMP device source code. Default value: *device.nut* |
| --agent-file | -y | no | yes | Name of a file for IMP agent source code. Default value: *agent.nut* |
| --create-files | -c | no | no | Creates empty file(s) if the file(s) referenced by [Project File](#project-file) as the file(s) with IMP device/agent source code do not exist. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Project Update

**impt project update \[--name <device_group_name>] \[--descr <device_group_description>] \[--device-file <device_file>] \[--agent-file <agent_file>] \[--rename-files] \[--create-files] \[--target <DEVICE_GROUP_IDENTIFIER>] \[--debug] \[--help]**

Updates the project settings and/or Name, Description, production target of the Device Group referenced by [Project File](#project-file).
Fails if there is no [Project File](#project-file) in the current directory.

Informs user if the Device Group referenced by [Project File](#project-file) does not exist. [Project File](#project-file) is not updated or deleted in this case. To delete it - explicitly call [**impt project delete**](#project-delete) command.

At the end of the command execution information about the project is displayed (as by [**impt project info**](#project-info) command).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --name | -n | no | yes | New Name of the Device Group referenced by [Project File](#project-file). Must be unique among all Device Groups in the Product. |
| --descr | -s | no | yes | New Description of the Device Group referenced by [Project File](#project-file). |
| --device-file | -x | no | yes | New name of a file for IMP device source code. |
| --agent-file | -y | no | yes | New name of a file for IMP agent source code. |
| --rename-files | -r | no | no | Renames file(s) (if existed) which were referenced by [Project File](#project-file) as the file(s) with IMP device/agent source code to the new name(s) specified by **--device-file**, **--agent-file** options. Should not be specified together with **--create-files** option. |
| --create-files | -c | no | no | Creates empty file(s) if the file(s) referenced by [Project File](#project-file) as the file(s) with IMP device/agent source code do not exist. Should not be specified together with **--rename-files** option. |
| --target | -t | no | yes | [Device Group Identifier](#device-group-identifier) of the production target Device Group for the Device Group referenced by [Project File](#project-file). May be specified if the Device Group referenced by [Project File](#project-file) is of the [type](#device-group-type) *pre-factory* only. The specified target Device Group must be of the [type](#device-group-type) *pre-production* and belongs to the same Product as the Device Group referenced by [Project File](#project-file). Otherwise the command fails. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Test Commands

#### Test Create
 
**impt test create --dg <DEVICE_GROUP_IDENTIFIER> \[--device-file <device_file>] \[--agent-file <agent_file>] \[--timeout \<timeout>] \[--stop-on-fail \[true|false]] \[--allow-disconnect \[true|false]] \[--builder-cache \[true|false]] \[--test-file <test_file_name_pattern>] \[--github-config <github_credentials_file_name>] \[--builder-config <builder_file_name>] \[--confirmed] \[--debug] \[--help]**

Creates [Test Configuration File](#test-configuration-file) in the current directory.

User is asked to confirm the operation if the current directory already contains [Test Configuration File](#test-configuration-file) (confirmed automatically with **--confirmed** option). If confirmed, the existed [Test Configuration File](#test-configuration-file) is overwritten.

At the end of the command execution information about the tests configuration is displayed (as by [**impt test info**](#test-info) command).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes | yes | [Device Group Identifier](#device-group-identifier) of Device Group whose Devices are used for tests execution. |
| --device-file | -x | no | yes | A path to an optional file with IMP device source code that is deployed along with the tests. A relative or absolute path can be used. |
| --agent-file | -y | no | yes | A path to an optional file with IMP agent source code that is deployed along with the tests. A relative or absolute path can be used. |
| --timeout | -t | no | yes | A timeout period (in seconds) after which a test is interrupted and considered as failed. By default: 30 seconds. |
| --stop-on-fail | -s | no | no | If *true* or no value: the whole tests execution is stopped after a test failure. If *false* value: the tests execution is not stopped after a failure. By default: *false* |
| --allow-disconnect | -a | no | no | If *true* or no value: keep a test session alive when a device is temporary disconnected. If *false* value: a test session fails when a device is disconnected. By default: *false* |
| --builder-cache | -e | no | no | If *true* or no value: cache external libraries in the local *.builder-cache* directory. If *false* value: do not cache external libraries. If the local *.builder-cache* directory exists, it is cleaned up. By default: *false* |
| --test-file | -f | no | yes | Test file name or pattern. All files located in the current directory and all its subdirectories which names match the specified name or pattern are considered as files with test cases. This option may be repeated several times to specify several names and/or patterns. The values of the repeated option are combined by logical OR. By default: *"\*.test.nut" "tests/\*\*/\*.test.nut"* |
| --github-config | -i | no | yes | A path to a github credentials file. A relative or absolute path can be used. The specified file may not exist. |
| --builder-config | -j | no | yes | A path to a file with *Builder* variables. A relative or absolute path can be used. The specified file may not exist. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Test Delete

**impt test delete \[--github-config] \[--builder-config] \[--entities] \[--all] \[--confirmed] \[--debug] \[--help]**

Deletes [Test Configuration File](#test-configuration-file) in the current directory.
Does nothing if there is no [Test Configuration File](#test-configuration-file) in the current directory.

The following entities are deleted (if existed):
- [Test Configuration File](#test-configuration-file) in the current directory.
- *Builder* cache (*.builder-cache* directory) in the current directory.
- Debug information (*.build* directory) in the current directory.
- if **--github-config** option is specified, the github credentials file referenced by the Test Configuration File.
- if **--builder-config** option is specified, the file with *Builder* variables referenced by the Test Configuration File.
- if **--entities** option is specified:
  - the Device Group referenced by the Test Configuration File. All Devices are unassigned from that Device Group.
  - all builds (Deployments) of the Device Group referenced by the Test Configuration File, including Deployments with *"flagged"* attribute set to *true*.
  - the Product which includes the Device Group referenced by the Test Configuration File. If the Product includes any additional Device Group, the Product is not deleted and it is not considered as a fail.

User is asked to confirm the operation (confirmed automatically with **--confirmed** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --github-config | -i | no | no | Also deletes the github credentials file referenced by [Test Configuration File](#test-configuration-file). |
| --builder-config | -j | no | no | Also deletes the file with *Builder* variables referenced by [Test Configuration File](#test-configuration-file). |
| --entities | -e | no | no | Also deletes the impCentral API entities (Device Group, Product, Deployments) referenced by [Test Configuration File](#test-configuration-file). See above. |
| --all | -a | no | no | Includes **--github-config**, **--builder-config** and **--entities** options. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Test Github

**impt test github --github-config <github_credentials_file_name> --user <github_username> --pwd <github_password> \[--confirmed] \[--debug] \[--help]**

Creates or updates github credentials file.

User is asked to confirm the operation if the specified github credentials file already exists (confirmed automatically with **--confirmed** option). If confirmed, the existed github credentials file is overwritten.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --github-config | -i | yes | yes | A path to the github credentials file. A relative or absolute path can be used. |
| --user | -u | yes | yes | GitHub username. |
| --pwd | -w | yes | yes | GitHub password or personal access token. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Test Info

**impt test info \[--debug] \[--help]**

Displays information about the tests configuration defined by [Test Configuration File](#test-configuration-file) in the current directory.
With every call the latest actual information is obtained using impCentral API.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Test Run

**impt test run \[--tests <test_pattern>] \[--clear-cache] \[--debug] \[--help]**

Runs the tests specified by [Test Configuration File](#test-configuration-file) in the current directory.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --tests | -t | no | yes | A pattern to select the tests. Allows to select specific test files, test cases, test methods for execution. The syntax of the pattern: *\[testFile]\[:testCase]\[::testMethod]*, where *testFile* may include a relative path as well as [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). If the option is missed all tests from all test files specified in [Test Configuration File](#test-configuration-file) are executed. |
| --clear-cache | -e | no | no | Clears the local *.builder-cache* directory if it exists. |
| --debug | -z | no | no | Runs the tests in the debug mode. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Test Update
 
**impt test update \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--device-file \[<device_file>]] \[--agent-file \[<agent_file>]] \[--timeout \<timeout>] \[--stop-on-fail \[true|false]] \[--allow-disconnect \[true|false]] \[--builder-cache \[true|false]] \[--test-file <test_file_name_pattern>] \[--github-config \[<github_credentials_file_name>]] \[--builder-config \[<builder_file_name>]] \[--debug] \[--help]**

Updates [Test Configuration File](#test-configuration-file) in the current directory. Fails if there is no [Test Configuration File](#test-configuration-file) in the current directory.

At the end of the command execution information about the tests configuration is displayed (as by [**impt test info**](#test-info) command).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | no | yes | [Device Group Identifier](#device-group-identifier) of Device Group whose Devices are used for tests execution. |
| --device-file | -x | no | no | A path to a file with IMP device source code that is deployed along with the tests. A relative or absolute path can be used. Specify this option w/o a value to remove this file from the test configuration. |
| --agent-file | -y | no | no | A path to a file with IMP agent source code that is deployed along with the tests. A relative or absolute path can be used. Specify this option w/o a value to remove this file from the test configuration. |
| --timeout | -t | no | yes | A timeout period (in seconds) after which a test is interrupted and considered as failed. |
| --stop-on-fail | -s | no | no | If *true* or no value: the whole tests execution is stopped after a test failure. If *false* value: the tests execution is not stopped after a failure. |
| --allow-disconnect | -a | no | no | If *true* or no value: keep a test session alive when a device is temporary disconnected. If *false* value: a test session fails when a device is disconnected. |
| --builder-cache | -e | no | no | If *true* or no value: cache external libraries in the local *.builder-cache* directory. If *false* value: do not cache external libraries; in this case, if the local *.builder-cache* directory exists, it is cleaned up. |
| --test-file | -f | no | yes | Test file name or pattern. All files located in the current directory and all its subdirectories which names match the specified name or pattern are considered as files with test cases. This option may be repeated several times to specify several names and/or patterns. The values of the repeated option are combined by logical OR. The specified values fully replace the existed setting. |
| --github-config | -i | no | no | A path to a github credentials file. A relative or absolute path can be used. The specified file may not exist. Specify this option w/o a value to remove a github credentials file from the test configuration. |
| --builder-config | -j | no | no | A path to a file with *Builder* variables. A relative or absolute path can be used. The specified file may not exist. Specify this option w/o a value to remove a file with *Builder* variables from the test configuration. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Webhook Manipulation Commands

#### Webhook Create

**impt webhook create \[--dg <DEVICE_GROUP_IDENTIFIER>] --url <target_url> --event <triggered_event> --mime <content_type> \[--debug] \[--help]**

Creates a new Webhook for the specified Device Group.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --url | -u | yes | yes | The Webhook's target URL. |
| --event | -e | yes | yes | The event that triggers the Webhook. Valid values: "blessing", "blinkup", "deployment". |
| --mime | -m | yes | yes | The MIME content-type of the event data. Valid values: "json", "urlencoded". |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Webhook Delete

**impt webhook delete --wh <webhook_id> \[--confirmed] \[--debug] \[--help]**

Deletes the specified Webhook.

User is asked to confirm the operation (confirmed automatically with **--confirmed** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --wh | -w | yes | yes | The Webhook id. |
| --confirmed | -q | no | no | Executes the operation w/o asking additional confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Webhook Info

**impt webhook info --wh <webhook_id> \[--debug] \[--help]**

Displays information about the specified Webhook.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --wh | -w | yes | yes | The Webhook id. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Webhook List

**impt webhook list \[--owner <ACCOUNT_IDENTIFIER>] \[--product <PRODUCT_IDENTIFIER>] \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--dg-type <device_group_type>] \[--url <target_url>] \[--event <triggered_event>] \[--debug] \[--help]**

Displays information about all Webhooks available to the current logged-in account.

The returned list of the Webhooks may be filtered. Filtering is possible by any combination of the described Filter Options. Every Filter Option may be repeated several times. At first, all Filter Options with the same option name are combined by logical OR. After that, all Filter Options with different option names are combined by logical AND.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |
| Filter Options: | | | | |
| --owner | -o | no | yes | Webhooks owned by the [specified Account(s)](#account-identifier) only. |
| --product | -p | no | yes | Webhooks created for Device Groups which belong to the [specified Product(s)](#product-identifier) only. |
| --dg | -g | no | yes | Webhooks created for the [specified Device Group(s)](#device-group-identifier) only. |
| --dg-type | -y | no | yes | Webhooks created for Device Groups of the [specified type](#device-group-type) only. |
| --url | -u | no | yes | Webhooks with the specified target URL only. |
| --event | -e | no | yes | Webhooks for the specified event only. Valid values: "blessing", "blinkup", "deployment". |

#### Webhook Update

**impt webhook update --wh <webhook_id> \[--url <target_url>] \[--mime <content_type>] \[--debug] \[--help]**

Updates the specified Webhook by a new target URL and/or MIME content-type.
Fails if the specified Webhook does not exist.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --wh | -w | yes | yes | The Webhook id. |
| --url | -u | no | yes | The Webhook's new target URL. |
| --mime | -m | no | yes | New MIME content-type of the event data. Valid values: "json", "urlencoded". |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

## List of Aliases

| Command Option Alias | Command Option Full Name(s) |
| --- | --- |
| -a | --all, --assigned, --allow-disconnect  |
| -b | --build, --builds  |
| -c | --create-files, --conditional  |
| -d | --device  |
| -e | --endpoint, --entities, --event, --builder-cache, --clear-cache  |
| -f | --force, --files, --pre-factory, --from, --flagged, --offline, --test-file  |
| -g | --dg  |
| -h | --help  |
| -i | --device-only, --create-product, --github-config  |
| -j | --agent-only, --create-target, --builder-config  |
| -k | --lk  |
| -l | --log, --local, --load-code-after-blessing  |
| -m | --min-supported-deployment, --mime, --zombie  |
| -n | --name, --online, --page-number, --non-zombie  |
| -o | --owner, --origin, --unflag-old  |
| -p | --product  |
| -q | --confirmed  |
| -r | --remove-tag, --rename-files, --remove  |
| -s | --descr, --sha, --page-size, --stop-on-fail  |
| -t | --tag, --timeout, --temp, --target, --to, --tests  |
| -u | --user, --full, --unflagged, --unflag, --unassigned, --unbond, --url  |
| -v |   |
| -w | --wh, --pwd  |
| -x | --device-file  |
| -y | --agent-file, --dg-type  |
| -z | --debug  |

## Common Filter Options

| Filter Option | Alias | Value | Description |
| --- | --- | --- | --- |
| --owner | -o | [<ACCOUNT_IDENTIFIER>](#account-identifier) | Entities owned by the specified Account only. |
| --product | -p | [<PRODUCT_IDENTIFIER>](#product-identifier) | Entities related to the specified Product only. |
| --dg | -g | [<DEVICE_GROUP_IDENTIFIER>](#device-group-identifier) | Entities related to the specified Device Group only. |
| --dg-type | -y | [<device_group_type>](#device-group-type) | Entities related to the Device Groups of the specified type only. |
