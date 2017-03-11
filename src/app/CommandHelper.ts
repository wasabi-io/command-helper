import PropsClass from "../util/PropClass";
import {hasValue} from "../util/Functions";
import Strings from "../util/Strings";
import StandartReaders from "./StandartReaders";
import Arrays from "../util/Arrays";
import {
    CommandHelperTemplate,
    CommandHelperProps,
    ParseResult,
    CommandState,
    CommandReaders, CommandReader
} from "./CommandHelperApi";
import {CommandHelperTable} from "./CommandHelperTable";

export default class CommandHelper extends PropsClass<CommandHelperProps> {
    static defaultProps: CommandHelperProps = {
        template: {
            name: null,
            version: null,
            options: {}
        },
        readers: StandartReaders
    };
    public constructor(props: CommandHelperProps) {
        super(props);
    }
    public parse(argv: string[], reader?: CommandReader, onHelp?): ParseResult {
        let isHelpCommand = false;
        let result = null;
        try {
            if(Arrays.has(argv) && argv.indexOf("--help") != -1) {
                isHelpCommand = true;
            }
            result = CommandHelper.parse(argv, this.props, reader);
        } catch (e) {
            if(!isHelpCommand) {
                throw e;
            }
        }
        if(isHelpCommand) {
            let helper = new CommandHelperTable(this.props);
            helper.help(result);
            if(onHelp) {
                onHelp()
            } else {
                process.exit(0);
            }
        }
        return result;
    }

    /**
     *
     * @param argv {string[]}
     * @param props {CommandHelperProps}
     * @return {ParseResult}
     */
    public static parse(argv: string[], props: CommandHelperProps, globalReader?: CommandReader): ParseResult {
        let hasArgs = Arrays.has(argv);
        let result = {
            options: {},
            rawArgs: hasArgs ? argv.slice(0): [],
            otherArgs: [],
            defaults: {}
        };
        if(!hasArgs) return result;
        let i = hasValue(props.start) ? props.start : 0;
        let commandState: CommandState = {
            command: null,
            template: null,
            argv,
            lastIndex: -1,
            part2: undefined
        };
        for(; i < argv.length; i++) {
            let isCommand = false;
            try {
                let arg = argv[i];
                if (!Strings.has(arg)) continue; // it's empty
                if (!Strings.startsWith(arg, "-")) continue; // it's not command
                let equalIndex = arg.indexOf("="); //
                let part2; // right of assign command like --debug-brk=1924
                if (equalIndex !== -1) {
                    part2 = arg.substring(equalIndex + 1);
                    arg = arg.substring(0, equalIndex);
                }
                let commandTemplate = props.template.options[arg];
                if (!hasValue(commandTemplate)) continue; // it's not defined command

                let command;
                if (typeof commandTemplate === "string") { // it's command alias
                    command = commandTemplate;
                    commandTemplate = props.template.options[commandTemplate as any];
                    if (!hasValue(commandTemplate)) continue; // alias is not found
                } else {
                    command = arg;
                }
                let commandName = commandTemplate.name || CommandHelper.convertKey(command);
                if (!hasValue(result.options[commandName]) || commandTemplate.infinity) {
                    let reader = props.readers[commandTemplate.type] || globalReader;
                    if (reader === null) {
                        throw new Error("Unknown Reader ! ");
                    }
                    commandState.command = command;
                    commandState.template = commandTemplate;
                    commandState.part2 = part2;
                    commandState.lastIndex = i;
                    if (reader(commandName, commandState, result.options) === true) {
                        let lastIndex = commandState.lastIndex >= i ? commandState.lastIndex : i;
                        if (commandTemplate.remove) {
                            for (let j = i; j <= lastIndex; j++) {
                                argv[j] = undefined;
                            }
                        }
                        i = lastIndex;
                        isCommand = true;
                    }
                }
            } finally {
                if(!isCommand) {
                    result.otherArgs.push(argv[i]);
                }
            }
        }
        Arrays.cleanValueFromArray(argv, undefined);
        let template = props.template;
        if(result) {
            for (let key in template.options) {
                if (!template.options.hasOwnProperty(key) ) continue;
                let commandTemplate = template.options[key];
                if(typeof commandTemplate === "string") continue;
                let commandName = commandTemplate.name || CommandHelper.convertKey(key);
                if (hasValue(result.options[commandName])) continue;
                result.options[commandName] = commandTemplate.default;
                result.defaults[commandName] = true;
            }
        }
        return result;
    }

    /**
     * get variable name of command by variable rule. like --debug-brk command variable name is debugBrk
     * @param key
     * @return {string}
     */
    private static convertKey(key): string {
        if (Strings.startsWith(key, "-")) {
            key = key.substring(1);
            if (Strings.startsWith(key, "-")) {
                key = key.substring(1);
            }
        }
        let keys = key.split("-");
        if (keys.length > 1) {
            for (let i = 1; i < keys.length; i++) {
                keys[i] = Strings.capitalizeFirstLetter(keys[i]);
            }
            key = keys.join("");
        }
        return key;
    }
}