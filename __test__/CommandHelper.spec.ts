import CommandHelper from "../src/app/CommandHelper";
import {expect} from "chai";
import template from "./template";

describe("app/CommandHelper", () => {
    it("parse", () => {
        let array = ["--debug-brk", "--root-list", "deneme", "--root-list", "test"];
        let helper = new CommandHelper({
            template
        });
        let expectedResult = {
            options: {
                debugBrk: true,
                interactive: false,
                renderer: false,
                rootList: ['deneme', 'test']
            },
            rawArgs: ['--debug-brk', '--root-list', 'deneme', '--root-list', 'test'],
            otherArgs: [],
            defaults: {
                interactive: true,
                renderer: true
            }
        };

        let result = helper.parse(array);
        expect(result).to.be.deep.eq(expectedResult);

        let expectedArray = ['--root-list', 'deneme', '--root-list', 'test'];
        expect(array).to.be.deep.eq(expectedArray);
    });
    it("help", () => {
        let array = ["--help", "--debug-brk", "--root-list", "deneme", "--root-list", "test"];
        let helper = new CommandHelper({
            template
        });
        let expectedResult = {
            options: {
                debugBrk: true,
                interactive: false,
                renderer: false,
                rootList: ['deneme', 'test']
            },
            rawArgs: ["--help", '--debug-brk', '--root-list', 'deneme', '--root-list', 'test'],
            otherArgs: ["--help"],
            defaults: {
                interactive: true,
                renderer: true
            }

        };
        let result = helper.parse(array, undefined, () => {

        });
        expect(result).to.be.deep.eq(expectedResult);

        let expectedArray = ["--help", '--root-list', 'deneme', '--root-list', 'test'];
        expect(array).to.be.deep.eq(expectedArray);
    })
});

