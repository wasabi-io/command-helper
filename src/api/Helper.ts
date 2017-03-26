import { has, Class, Strings } from "wasabi-common";
import {CommandState, Reader} from "../Api";
import {ResultOption } from "../Api";
import Template, { TemplateProps } from "./Template";
import * as Readers from "./Readers";
import Objects from "wasabi-common/lib/types/Objects";
import Arrays from "wasabi-common/lib/types/Arrays";
import HelperBoard from "../help/HelperBoard";

/**
 * Provides to parse arguments by the given template.
 * @export
 * @default Helper
 */
export default class Helper extends Class {
    private props: TemplateProps;
    public constructor(props: TemplateProps, readers?: {[key: string]: Reader}) {
        super();
        props.readers = Objects.mergeDefaults(Readers, readers) as any;
        this.props = Template.fixTemplate(props);
    }

    /**
     * Parse arguments by the given template.
     * @param args
     * @return {ResultOption}
     */
    public parse(args: Array<string>): ResultOption {
        let result: ResultOption = {
            args: args.slice(0),
            otherArgs: [],
            defaults: {},
            options: {}
        };

        let props = this.props;

        let commandState: CommandState = {
            command: null,
            name: null,
            template: null,
            i: 0,
            args: args
        };

        for(let i = 0 ; i < args.length; i++) {
            let isCommand = false;
            let arg = args[i];
            try {
                commandState.command = arg;
                if (!Strings.startsWith(commandState.command, "-")) continue;
                let equalPart;
                let equalIndexOf = commandState.command.indexOf("=");
                if (equalIndexOf != -1) {
                    equalPart = commandState.command.substring(equalIndexOf + 1);
                    commandState.command = commandState.command.substring(0, equalIndexOf);
                }

                commandState.name = props.commands[commandState.command];
                if (!has(commandState.name)) continue;
                commandState.template = props.options[commandState.name];
                if (!has(commandState.template)) continue;
                let optionValue = result.options[commandState.name];
                if (optionValue && !commandState.template.infinity) continue;
                commandState.i = i;
                let reader = commandState.template.reader;
                isCommand = reader.main(commandState, result.options, reader.related);
                if(!isCommand) continue;

                // it is command
                if(commandState.template.remove === true) {
                    for(let j = i ; j <= commandState.i; j++ ) {
                        args[j] = undefined;
                    }
                    let nextIndex = commandState.i + 1;
                    if(args.length > nextIndex) {
                        if(args[nextIndex] === "--" || args[nextIndex] === "-") {
                            args[nextIndex] = undefined;
                            commandState.i = nextIndex;
                        }
                    }
                }
                if(commandState.i > i) {
                    i = commandState.i;
                }
            }finally {
                if(!isCommand) {
                    result.otherArgs.push(arg);
                }
            }
        }
        Arrays.removeValue(args, undefined);

        Objects.forEach(props.options, (option, name) => {
            if(!has(result.options[name]) && has(option.defaultValue)) {
                result.options[name] = option.defaultValue;
                result.defaults[name] = true;
            }
        });
        this.help(props, result);
        return result;
    }

    /**
     * Checks help command and if help is exist then call HelpBoard.
     * @param template
     * @param result
     */
    public help(template: TemplateProps, result: ResultOption){
        let helpIndex = result.otherArgs.indexOf("--help");
        if(helpIndex === -1) {
            helpIndex = result.otherArgs.indexOf("-h");
        }
        if(helpIndex === -1) return;
        HelperBoard.help(template, result);
    }

    public getProps(): TemplateProps {
        return this.props;
    }
}