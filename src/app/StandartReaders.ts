import {CommandReaders, CommandState} from "./CommandHelperApi";
import {hasValue} from "../util/Functions";
import Strings from "../util/Strings";

const boolean = (name: string, state: CommandState, options): boolean => {
    options[name] = hasValue(state.template.default) ? !state.template.default: true;
    return true;
};

const string = (name: string, state: CommandState, options): boolean => {
    if(Strings.has(state.part2)) {
        options[name] = state.part2;
        return true;
    }
    state.lastIndex++;
    if(state.argv.length > state.lastIndex) {
        let value = state.argv[state.lastIndex];
        if(Strings.has(value) && !Strings.startsWith(value, "-")) {
            options[name] = value;
            return true;
        }
    }
    state.lastIndex--;
    return false;
};

const array = (name: string, state: CommandState, options): boolean => {
    if(state.argv.length - 1 > state.lastIndex) {
        let values = [];
        do {
            state.lastIndex++;
            let value = state.argv[state.lastIndex];
            if(!Strings.has(value) || Strings.startsWith(value, "-")) {
                break;
            }
            values.push(value);
        } while (state.argv.length > state.lastIndex);
        state.lastIndex--;
        if(values.length === 0) {
            return false
        }
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

