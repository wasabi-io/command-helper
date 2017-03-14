import StandardReaders from "app/StandardReaders";
import { expect } from "chai";

describe("app/StandardReaders", () => {
    it("boolean", () => {
        let readerState = {
            command: "--example-command",
            template: {
                type: "boolean",
                usage: 1
            },
            argv: ["--example-command", "--command2"],
            lastIndex: 0
        };
        let options: any = {};
        StandardReaders.boolean("exampleCommand", readerState , options);
        expect(options.exampleCommand).to.be.eq(true);
    });

    it("string", () => {
        let expectedValue = "value1";
        let readerState = {
            command: "--example-command",
            template: {
                type: "string",
                usage: 1
            },
            argv: ["--example-command", expectedValue],
            lastIndex: 0
        };
        let options: any = {};
        StandardReaders.string("exampleCommand", readerState , options);
        expect(options.exampleCommand).to.be.eq(expectedValue);
    });

    it("array", () => {
        let expectedValue = ["value1"];
        let readerState = {
            command: "--example-command",
            template: {
                type: "array",
                usage: 1
            },
            argv: ["--example-command", expectedValue[0]],
            lastIndex: 0
        };
        let options: any = {};
        StandardReaders.array("exampleCommand", readerState , options);
        expect(options.exampleCommand).to.be.deep.eq(expectedValue);
    })
});