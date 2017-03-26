import { has, Strings } from "wasabi-common";
import { CommandState } from "../Api";

/**
 * Provides some command reader util operations.
 * @export
 * @static
 * @class ReaderUtil
 */
export default class ReaderUtil {
    /**
     *
     * get one value from the command if exist.
     * @param state
     * @return {string}
     */
    public static getOne(state: CommandState) {
        let nextIndex = state.i + 1;
        if(state.args.length > nextIndex) {
            let value = state.args[nextIndex];
            if(Strings.has(value) && !Strings.startsWith(value, "-")) {
                state.i = nextIndex;
                return value;
            }
        }
    }

    /**
     *
     * get list of command from the array.
     * @param state
     * @return {Array}
     */
    public static getList(state: CommandState) {
        if(state.args.length - 1 > state.i) {
            let values = [];
            if(state.template.reader.related) {
                do {
                    let opts = {};
                    if (state.template.reader.related(state, opts) !== true) {
                        break;
                    }
                    let value = opts[state.name];
                    if (has(value)) {
                        values.push(value);
                    }
                }while (state.args.length > state.i)
            } else do {
                let value = ReaderUtil.getOne(state);
                let hasValue = has(value);
                if(!hasValue) break;
                values.push(value);
            } while (state.args.length > state.i);
            if(values.length > 0) return values;
        }
    }
}