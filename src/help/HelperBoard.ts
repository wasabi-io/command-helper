import { has, Objects } from "wasabi-common";
import {TemplateProps} from "../api/Template";
import {ResultOption} from "../Api";

/**
 * Writes help board by the given template.
 * @export
 * @static
 * @default HelperBoard
 */
export default class HelperBoard {
    public static help(template: TemplateProps, parseResult: ResultOption) {
        let boardTemplate = Objects.clone(template);
        Objects.forEach(boardTemplate.commands, (name, command) => {
            let options = boardTemplate.options[name];
            if(has(options)) {
                if(!options.commands) {
                    options.commands = [];
                }
                if(options.commands.indexOf(command) === -1) {
                    options.commands.push(command);
                }
            }
        });
        HelperBoard.write(boardTemplate, parseResult);
    }

    private static write(template: TemplateProps, result: ResultOption) {
        const Table = require("cli-table");
        let table = new Table({
            colWidths: [20, 40, 20, 20, 20, 40],
            chars: {
                "top": "",
                "top-mid": "",
                "top-left": "",
                "top-right": "",
                "bottom": "=",
                "bottom-mid": "",
                "bottom-left": "",
                "bottom-right": "",
                "left": "",
                "left-mid": "",
                "mid": "",
                "mid-mid": "",
                "right": "",
                "right-mid": "",
                "middle": " "
            },
            style: {"padding-left": 4, "padding-right": 0}
        });

        console.log(` Usage: ${template.name} [options]\n`);
        console.log(` Options: \n`);
        table.push(["Command", "Usage", "Type", "Default", "Infinity", "Description"]);
        console.log(table.toString());
        table.splice(0);
        table.options.chars.bottom = "-";
        let options = template.options;

        for(let key in options) {
            if(!options.hasOwnProperty(key)) continue;
            let option = options[key];
            if(!has(option.commands)) continue;
            let row = [];
            row.push(option.commands);
            switch (option.usage) {
                case 0:
                    row.push(option.commands[0]);
                    break;
                case 1:
                    row.push(option.commands[0] + " value");
                    break;
                case -1:
                    row.push(option.commands[0] + " value1, [value2, ...]");
                    break;
                default:
                    row.push(option.usage ? option.usage: "");
            }
            row.push(has(option.reader.name)? option.reader.name.toString(): "");
            row.push(has(option.defaultValue)? option.defaultValue.toString(): "");
            row.push(has(option.infinity)? option.infinity.toString(): "");
            row.push(has(option.description)? option.description: "");
            table.push(row);
        }
        console.log(table.toString());
    }
}
