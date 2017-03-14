import { Strings } from "wasabi-common"

export interface FinderState {
    argv: string[],
    part2?: string,
    lastIndex: number,
    [key: string]: any
}

export default class Finder {
    static getOne(state: FinderState): string {
        if(Strings.has(state.part2)) {
            return state.part2;
        }
        state.lastIndex++;
        if(state.argv.length > state.lastIndex) {
            let value = state.argv[state.lastIndex];
            if(Strings.has(value) && !Strings.startsWith(value, "-")) {
                return value;
            }
        }
        state.lastIndex--;
    }

    static getList(state: FinderState): string[] {
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
            if(values.length > 0) {
                return values;
            }
        }
    }
}