import { has, Strings, Arrays } from "wasabi-common";
import {CommandReaders, CommandState} from "./HelperApi";
import Finder from "../util/Finder";

const boolean = (name: string, state: any, options): boolean => {
    options[name] = has(state.template.default) ? !state.template.default: true;
    return true;
};

const string = (name: string, state: any, options): boolean => {
    let value = Finder.getOne(state);
    if(Strings.has(value)) {
        options[name] = value;
        return true;
    }
    return false;
};

const array = (name: string, state: any, options): boolean => {
    let values = Finder.getList(state);
    if(Arrays.has(values)) {
        options[name] = options[name] ? options[name].concat(values): values;
        return true;
    }
    return false;
};

const StandardReaders: CommandReaders = {
    boolean,
    string,
    array
};

export default StandardReaders;

