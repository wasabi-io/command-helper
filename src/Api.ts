export interface ReaderFunction {
    <T>(state: CommandState, opts, related?: ReaderFunction): boolean
}
export interface Reader {
    name: string,
    main: ReaderFunction,
    related: ReaderFunction
}

export interface CommandTemplate {
    reader?: Reader
    defaultValue?: any,
    remove?: boolean,
    infinity?: boolean
}

export interface CommandState {
    command: string,
    name: string,
    template: CommandTemplate,
    i: number,
    args: string[]
}

export interface ResultOption {
    args: string[],
    otherArgs: string[],
    defaults: {
        [key: string]: boolean
    }
    options: {
        [key: string]: any
    }
}