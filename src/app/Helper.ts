import { has, PropClass, Strings, Arrays } from "wasabi-common";
import StandardReaders from "./StandardReaders";
import {
    HelperProps,
    ParseResult,
    CommandState,
    CommandReader
} from "./HelperApi";
import HelperBoard from "./HelperBoard";

export default class Helper extends PropClass {
    static defaultProps: HelperProps = {
        template: {
            name: null,
            version: null,
            options: {}
        },
        readers: StandardReaders
    };
    public constructor(props: HelperProps) {
        super(props);
    }
    public parse(argv: string[], reader?: CommandReader, onHelp?): ParseResult {
        let isHelpCommand = false;
        let result = null;
        try {
            if(Arrays.has(argv) && argv.indexOf("--help") != -1) {
                isHelpCommand = true;
            }
            result = Helper.parse(argv, this.props, reader);
        } catch (e) {
            if(!isHelpCommand) {
                throw e;
            }
        }
        if(isHelpCommand) {
            let helper = new HelperBoard(this.props);
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
     * @param props {HelperProps}
     * @param globalReader? { CommandReader }
     * @return {ParseResult}
     */
    public static parse(argv: string[], props: HelperProps, globalReader?: CommandReader): ParseResult {
        let hasArgs = Arrays.has(argv);
        let result = {
            options: {},
            rawArgs: hasArgs ? argv.slice(0): [],
            otherArgs: [],
            defaults: {}
        };
        if(!hasArgs) return result;
        let i = has(props.start) ? props.start : 0;
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
                if (!has(commandTemplate)) continue; // it's not defined command

                let command;
                if (typeof commandTemplate === "string") { // it's command alias
                    command = commandTemplate;
                    commandTemplate = props.template.options[commandTemplate as any];
                    if (!has(commandTemplate)) continue; // alias is not found
                } else {
                    command = arg;
                }
                let commandName = commandTemplate.name || Helper.convertKey(command);
                if (!has(result.options[commandName]) || commandTemplate.infinity) {
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
        Arrays.removeValue(argv, undefined);
        let template = props.template;
        if(result) {
            for (let key in template.options) {
                if (!template.options.hasOwnProperty(key) ) continue;
                let commandTemplate = template.options[key];
                if(typeof commandTemplate === "string") continue;
                let commandName = commandTemplate.name || Helper.convertKey(key);
                if (has(result.options[commandName])) continue;
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