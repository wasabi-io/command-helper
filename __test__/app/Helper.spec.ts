import Helper from "app/Helper";
import template from "../template";
import {expect} from "chai";
import {CommandState} from "../../src/app/HelperApi";
import Finder from "../../src/util/Finder";
import Strings from "wasabi-common/lib/types/Strings";
describe("app/Helper", () => {
    it("parse", () => {
        let helper = new Helper({
            template
        });

        let array = ["--renderer", "--another_command", "--debug-brk"];

        let expectedResult = {
            options: {
                renderer: true,
                debugBrk: true,
                interactive: false,
                rootList: []
            },
            rawArgs: ["--renderer", "--another_command", "--debug-brk"],
            otherArgs: ["--another_command"],
            defaults: {interactive: true, rootList: true}
        };

        let result = helper.parse(array);
        expect(result).to.be.deep.eq(expectedResult);
    });

    it("parse & customer & reader", () => {

        template.options["--char-command"] = {
            "type": "chars",
            "default": [],
            "usage": 0,
            "remove": true,
            "description": "run program in debug mode"
        };
        let helper = new Helper({
            template
        });

        let array = ["--renderer", "--another_command", "--debug-brk", "--char-command", "test"];

        let expectedResult = {
            options: {
                charCommand: ["t", "e", "s", "t"],
                renderer: true,
                debugBrk: true,
                interactive: false,
                rootList: []
            },
            rawArgs: ["--renderer", "--another_command", "--debug-brk", "--char-command", "test"],
            otherArgs: ["--another_command"],
            defaults: {
                interactive: true,
                rootList: true
            }
        };


        let result = helper.parse(array, (name: string, state: CommandState, options: any) => {
            let value = Finder.getOne(state);
            if (value) {
                options[name] = value.split("");
                return true;
            }
        });
        expect(result).to.be.deep.eq(expectedResult);
    })


    it("onHelp", () => {
        let helper = new Helper({
            template
        });

        let array = ["--help"];
        let isOk = false;
        let result = helper.parse(array, undefined, () => {
            isOk = true;
        });
        expect(isOk).to.be.eq(true);

        let expectedResult = {
            options: {
                renderer: false,
                interactive: false,
                rootList: [],
                debugBrk: false,
                charCommand: []
            },
            rawArgs: ["--help"],
            otherArgs: ["--help"],
            defaults: {
                renderer: true,
                interactive: true,
                rootList: true,
                debugBrk: true,
                charCommand: true
            }
        };
        expect(result).to.be.deep.eq(expectedResult);
    });
});
