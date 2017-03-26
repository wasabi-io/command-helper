import {has} from "wasabi-common";
import {resolve} from "path";
import ReaderUtil from "../util/ReaderUtil";
import {CommandState} from "../Api";

let fs = null;

/**
 * Reads Boolean commands from the given arguments.
 * @param state
 * @param opts
 * @return {boolean}
 * @constructor
 */
const Boolean = (state: CommandState, opts) => {
    if (!has(opts[state.name]) && state.args.length > state.i) {
        let def = state.template.defaultValue;
        opts[state.name] = has(def) ? !def : true;
        return true;
    }
    return false;
};
/**
 * Reads String commands from the given arguments.
 * @param state
 * @param opts
 * @return {boolean}
 * @constructor
 */
const String = (state: CommandState, opts) => {
    if (!has(opts[state.name])) {
        let value = ReaderUtil.getOne(state);
        if (has(value)) {
            opts[state.name] = value;
            return true;
        }
    }
    return false;
}

/**
 * Reads TextFile String commands from the given arguments.
 * @param state
 * @param opts
 * @return {boolean}
 * @constructor
 */
const TextFile = (state: CommandState, opts) => {
    let setFile = String(state, opts);
    if (!setFile) return false;
    fs = fs || require("fs");
    let fileData = fs.readFileSync(resolve(process.cwd(), opts[state.name]), "UTF-8");
    opts[state.name] = fileData;
    return true;
}

/**
 * Reads JsonFile String commands from the given arguments.
 * @param state
 * @param opts
 * @return {boolean}
 * @constructor
 */
const JsonFile = (state: CommandState, opts) => {
    let options: any = {};
    if (TextFile(state, options)) {
        opts[state.name] = JSON.parse(options[state.name]);
        return true;
    }
    return false;
}

/**
 * Reads Array<String> commands from the given arguments.
 * @param state
 * @param opts
 * @return {boolean}
 * @constructor
 */
const Array = <T>(state: CommandState, opts) => {
    let values = opts[state.name];
    if (!values || state.template.infinity === true) {
        let result = ReaderUtil.getList(state);
        if (result && result.length > 0) {
            opts[state.name] = values ? values.concat(result) : result;
            return true;
        }
    }
    return false;
};

export {
    Boolean,
    String,
    TextFile,
    JsonFile,
    Array
};




