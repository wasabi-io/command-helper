import { has, Class, Objects, Types } from "wasabi-common";
import {CommandTemplate, Reader} from "../Api";

export interface TemplateProps {
    name: string,
    version: string,
    addDefaults?: boolean,
    readers?: {
      [key: string]: Reader
    },
    commands: {
        [key: string]: string
    },
    options: {
        [key: string]: any
    }
}

/**
 * Fixed the given template.
 * @export
 * @static
 * @default Template
 */
export default class Template extends Class {
    // public static readonly VARIABLE_REGEX = /^\$\{[ ]*(.*)[ ]*\}$/i;
    public static readonly GENERIC_REGEX = /^(.*)<(.*)>$/i;
    public static readonly defaultCommandTemplate = {
        remove: true,
        infinity: false
    };

    /**
     * Fixes template.
     * @param template
     * @return {TemplateProps}
     */
    public static fixTemplate(template: TemplateProps): TemplateProps {
        template = Objects.clone(template);
        let changed: any = {};
        Objects.forEach(template.commands, (name, command) => {
            let opts = template.options[name];
            if(has(opts)) {
                if(Types.getRawName(opts.reader) === Types.ToString.String) {
                    let matches = Template.GENERIC_REGEX.exec(opts.reader);
                    let reader: any = {
                        name: opts.reader
                    };
                    if(has(matches) && matches.length > 2) {
                        reader.main = template.readers[matches[1]];
                        reader.related = template.readers[matches[2]];
                    } else {
                        reader.main = template.readers[opts.reader];
                    }
                    opts.reader = reader;
                }
                if(!changed[name]) {
                    template.options[name] = Objects.mergeDefaults(Template.defaultCommandTemplate, opts);
                }
            }
        });
        return template;
    }
}