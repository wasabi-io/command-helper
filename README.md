## command-helper

### Motivation

* Command Helper is used to get result from the given commands and provides to remove current command from the given command array if needed.
* You can use standart readers (boolean, string, array ) to read command and also you can define custom readers to read commands.

#### Template Format
* <a name="CommandHelperProps"></a>CommandHelperProps
    - start? {number} : read command by start index from the given command array
    - template?: [CommandHelperTemplate](#CommandHelperTemplate),
    - readers?: [CommandReaders](#CommandReaders) 

```typescript
export interface CommandHelperProps {
    start?: number, // define command start index
    template?: CommandHelperTemplate,  // command template
    readers?: CommandReaders // command readers
}
```


* <a name="CommandReaders"></a>Command Readers : Holds readers to read commands by the command type.
    - key {string} : [CommandReader](#CommandReader)
    
```typescript
export interface CommandReaders {
    [key: string]: CommandReader
}
```

* <a name="CommandReader"></a>Command Reader: Provides to read command. 
    - (name {string}, state {[CommandState](#CommandState)} , options {key {string}: any}) => {any}

```typescript
export interface CommandReader {
    (name: string, state: CommandState, options: {[key: string]: any}): any
}
```

* <a name="CommandHelperTemplate"></a>Command Helper Template 
    - name: string,
    - version: string,
    - options {key {string}: alias or [CommandTemplate](#CommandTemplate) }

```typescript
export interface CommandHelperTemplate {
    name: string,
    version: string,
    options : {
        [key: string]: any
    }
}
```

* <a name="CommandTemplate"></a>Command Template 
    - type: string
    - default?: string
    - remove?: boolean
    - infinity?: boolean

```typescript
// Command Template
export interface CommandTemplate {
    type: string
    default?: string
    remove?: boolean
    infinity?: boolean
}
```

* <a name="CommandState"></a>Command State 
    - command: string,
    - template: CommandTemplate,
    - argv: string[],
    - lastIndex: number,
    - part2: string

```typescript
export interface CommandState {
    command: string,
    template: CommandTemplate,
    argv: string[],
    lastIndex: number,
    part2: string
}
```

* <a name="ParseResult"></a>Parse Result
    - options: { key {string}: value {any} }
    - rawArgs: string[]
    - otherArgs: string[]
    - defaults: { key {string}: {boolean} }

```typescript
export interface ParseResult {
    options: {
        [key: string]: any
    }
    rawArgs: string[]
    otherArgs: string[]
    defaults: {
        [key: string]: boolean
    }
}
```


* Flags: 
    - type
    - default
    - infinity
    - description
    - remove 
    
* Standart Readers
    - boolean
    - string
    - array

* Add Custom Reader

* Use callback to parse command



#### Example Template

* Template Parameter
```typescript
let template = {
  name: "application",
  version: "v1.0",
  options: {
    "--renderer": {
      "type": "boolean",
      "usage": 0,
      "default": false,
      "description": "show view on ui"
    },
    "--interactive": {
      "type": "boolean",
      "usage": 0,
      "default": false,
      "description": "show view in watch mode"
    },
    "--root-list": {
      "type": "array",
      "default": [],
      "usage": -1,
      "infinity": true,
      "description": "provides to resolve file in root folders"
    },
    "--debug-brk": {
      "type": "boolean",
      "default": false,
      "usage": 0,
      "remove": true,
      "description": "run program in debug mode"
    }
  }
};

let helper = new CommandHelper(template);
```

* Given Array
```javascript
helper.parse(['--renderer', '--another_command', '--debug-brk'])
```

* parse result
```javascript
{
    options: {
        renderer: true,
        debugBrk: true,
        interactive: false,
        rootList: []
    },
    rawArgs: ['--renderer', '--another_command', '--debug-brk'],
    otherArgs: ['--another_command'],
    defaults: {interactive: true, rootList: true}
}
```

* Help Example

```javascript
helper.parse(['--help'])
```

* Help Result
```
 Usage: command-helper [options]

 Options: 

    Command              Usage                                    Type                 Default              Infinity             Description                         
==================================================================================================================================================================
    --renderer           --renderer                               boolean              false                                     show view on ui                     
    --interactive        --interactive                            boolean              false                                     show view in watch mode             
    --root-list          --root-list value1, [value2, ...]        array                                     true                 provides to resolve file in root fo…
    --debug-brk          --debug-brk                              boolean              false                                     run program in debug mode           
------------------------------------------------------------------------------------------------------------------------------------------------------------------

```
