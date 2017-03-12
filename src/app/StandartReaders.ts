import {CommandReaders, CommandState} from "./CommandHelperApi";
import {hasValue} from "../util/Functions";
import Strings from "../util/Strings";
import Finder from "../util/Finder";
import Arrays from "../util/Arrays";

const boolean = (name: string, state: CommandState, options): boolean => {
    options[name] = hasValue(state.template.default) ? !state.template.default: true;
    return true;
};

const string = (name: string, state: CommandState, options): boolean => {
    let value = Finder.getOne(state);
    if(Strings.has(value)) {
        options[name] = value;
        return true;
    }
    return false;
};

const array = (name: string, state: CommandState, options): boolean => {
    let values = Finder.getList(state);
    if(Arrays.has(values)) {
        options[name] = options[name] ? options[name].concat(values): values;
        return true;
    }
    return false;
};

const StandartReaders: CommandReaders = {
    boolean,
    string,
    array
};

export default StandartReaders;

