import { has, Objects } from "wasabi-common";
import {
    HelperTemplate,
    ParseResult,
    HelperProps
} from "./HelperApi";


export default class HelperBoard {
    private props: HelperProps;
    public constructor(props: HelperProps){
        props.template = HelperBoard.initTemplate(props.template);
        this.props = props;
    }

    help(parseResult: ParseResult){
        HelperBoard.help(this.props, parseResult);
    }

    private static help(props: HelperProps, result: ParseResult) {
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
        let template = props.template;
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
            let row = [];
            let aliases = option.alias || [];
            aliases.unshift(key);
            row.push(aliases.join(", "));
            switch (option.usage) {
                case 0:
                    row.push(aliases[0]);
                    break;
                case 1:
                    row.push(aliases[0] + " value");
                    break;
                case -1:
                    row.push(aliases[0] + " value1, [value2, ...]");
                    break;
            }
            row.push(has(option.type)? option.type.toString(): "");
            row.push(has(option.default)? option.default.toString(): "");
            row.push(has(option.infinity)? option.infinity.toString(): "");
            row.push(has(option.description)? option.description: "");
            table.push(row);
        }
        console.log(table.toString());
    }



    private static initTemplate(template: HelperTemplate): HelperTemplate{
        let newTemplate: HelperTemplate = Objects.clone(template);
        for(let key in newTemplate.options) {
            if(!newTemplate.options.hasOwnProperty(key)) continue;
            let alias = newTemplate.options[key];
            if(typeof alias === "string") {
                delete newTemplate.options[key];
                let option = newTemplate.options[alias];
                if(!option) continue;
                if(!option.alias) option.alias = [];
                option.alias.push(key);
            }
        }
        return newTemplate;
    }
}
