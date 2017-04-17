## command-helper

[![npm package](https://badge.fury.io/gh/kbukum%2Fwasabi-common.svg)](https://badge.fury.io/gh/kbukum%2Fwasabi-common.svg)
[![Build Status](https://travis-ci.org/kbukum/command-helper.svg?branch=master)](https://travis-ci.org/kbukum/command-helper)
[![codecov](https://codecov.io/gh/kbukum/command-helper/branch/master/graph/badge.svg)](https://codecov.io/gh/kbukum/command-helper)

#### Motivation

* Command Helper is used to get result from the given commands and provides to remove current command from the given command array if needed.
* You can use standart readers (boolean, string, array ) to read command and also you can define custom readers to read commands.

#### [Type Docs](https://wasabi-io.github.io/command-helper)

#### Template Format

#### <a name="Main Template"></a>Main Template
* name : name of your bin js file.
* version: version of your library.
* commands: command reference to find your command template.
* options: holds each command template options.

```json
{
  "name": "command-helper",
  "version": "1.0.0",
  "commands": {
    ...
  },
  "options": {
    ...
  }
}

```

#### <a name="Command Template"></a>Command Template

* Main Template -> options[key]: Define command template in ${Main Template}.options{variable name}
    - reader: Reader is read command and find value of command in the given arguments.
        - name: Its shown on help board.
        - main: it is reader function to read the command and find its values. 
        - related: called by main reader if exist. 
    - defaultValue: it is default value for the command.
    - remove: Indicates if the command read in the given arguments then remove all things about the command from the given arguments.
    - infinity: read command recursively from the given arguments.
    - description: Its shown on help board.
    - usage:  Its used on help board.
        - usage = 0 then --command
        - usage = 1 then --command value
        - usage = -1 then --files value1, [value2, ...]
        - else shows usage if exist.

- Short Template: It used when the template file keeps as json. 

```json
{
    "reader": "Boolean",
    "defaultValue": false,
    "description": "Renderer Description",
    "usage": 0
}
```

- Full Template: If you need to set custom readers then you can use full template.

```json
{
    "reader": {
        "name": "Array<JsonFile>",
        "main": Readers.Array,
        "related": Readers.JsonFile
      },
      "defaultValue": [],
      "remove": true,
      "infinity": false,
      "description": "Json Files Description",
      "usage": -1
}
```

#### Standart Readers 

* Boolean `[...,"--command",....]`
* String -> `[...,"--command", "value",....]` or `[...,"--command=value",....]`
* Array (Array<String>) ["--command", "value1", "value2", "value3"]
* TextFile -> `[...,"--command", "path",....]` or `[...,"--command=path",....]`
* JsonFile -> `[...,"--command", "path",....]` or `[...,"--command=path",....]`
* Array<TextFile> `[...,"--command", "path1", "path2", "path3",....]`
* Array<JsonFile> `[...,"--command", "path1", "path2", "path3",....]`

* You can override standard readers when you call Helper file.


```typescript
import {  } "api/Api";
let customReaders = {
     Boolean: (state: CommandState, opts) => {
         if (!has(opts[state.name]) && state.args.length > state.i) {
             let def = state.template.defaultValue;
             opts[state.name] = has(def) ? !def : true;
             return true;
         }
         return false;
     },
     NewType: (state: CommandState, opts) => {
         if (!has(opts[state.name]) && state.args.length > state.i) {
             let def = state.template.defaultValue;
             opts[state.name] = has(def) ? !def : true;
             return true;
         }
         return false;
     } 
}

let helper = new Helper(template, customerReaders)

```
#### Examples 

* Json Template Example

```typescript
let templateJson = {
  "name": "command-helper",
  "version": "1.0.0",
  "commands": {
    "--renderer": "renderer",
    "--interactive": "interactive",
    "--base-url": "baseUrl",
    "--root-list": "rootList",
    "--opts": "opts",
    "--tdd-json": "tddJson",
    "--files": "files",
    "--another-files": "anotherFiles",
    "--json-files": "jsonFiles"
  },
  "options": {
    "renderer": {
      "reader": "Boolean",
      "defaultValue": false,
      "description": "Renderer Description",
      "usage": 0
    },
    "interactive": {
      "reader": "Boolean",
      "defaultValue": false,
      "description": "Interactive Description",
      "usage": 0
    },
    "baseUrl": {
      "reader": "String",
      "defaultValue": "",
      "description": "Base Url Description",
      "usage": 1
    },
    "rootList": {
      "reader": "Array",
      "defaultValue": [],
      "description": "Root List Description",
      "usage": -1
    },
    "opts": {
      "reader": "TextFile",
      "defaultValue": "",
      "description": "Opts Description",
      "usage": 1
    },
    "tddJson": {
      "reader": "JsonFile",
      "defaultValue": {},
      "description": "Tdd Json Description",
      "usage": 1
    },
    "files": {
      "reader": "Array<TextFile>",
      "defaultValue": [],
      "description": "Files Description",
      "usage": -1
    },
    "jsonFiles": {
      "reader": "Array<JsonFile>",
      "defaultValue": [],
      "description": "Json Files Description",
      "usage": -1
    }
  }
}
let helper = new Helper(template);
let result = helper.parse(process.argv);
```

#### Contribute

* Install 

```bash
$ git clone https://github.com/wasabi-io/command-helper.git`
$ cd command-helper
$ npm install
```

* Test

```bash
$ npm test
```

* Coverage

```bash
$ npm run coverage
```


* Export Docs

```bash
$ npm run docs
```

* Build Code as javascript (common-js)

```bash
$ npm build
```
