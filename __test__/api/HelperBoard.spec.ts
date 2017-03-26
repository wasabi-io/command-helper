import {resolve} from "path";
import Helper from "api/Helper";
import { expect } from "chai";
const fixedTemplate = require("./data/FixedTemplate");
const template = require("./data/template.json");
const packageJson = require("../../package.json");
const tsConfigJson = require("../../tsconfig.json");

describe("api/Helper", () => {

    it("parse", () => {
        let helper = new Helper(
            template
        );
        let givenArgs = [
            "--help",
            "--renderer",
            "--root-list",
            "src",
            "__test__",
            "--test",
            "--base-url",
            "src",
            "--files",
            "mocha.opts",
            "LICENSE",
            "--",
            "--tdd-json",
            "package.json",
            "--opts",
            "mocha.opts",
            "--json-files",
            "package.json",
            "tsconfig.json"
        ];
        let fs = require("fs");
        let mochaOpts = fs.readFileSync(resolve(process.cwd(), "mocha.opts"), "UTF-8");
        let LICENSE = fs.readFileSync(resolve(process.cwd(), "LICENSE"), "UTF-8");

        let expectedResult = {
            args: givenArgs.slice(0),
            otherArgs: ["--help", "--test"],
            defaults: {
                "interactive": true
            },
            options: {
                "baseUrl": "src",
                "files": [
                    mochaOpts,
                    LICENSE
                ],
                "interactive": false,
                "jsonFiles": [
                    packageJson,
                    tsConfigJson
                ],
                "opts": mochaOpts,
                "renderer": true,
                "rootList": [
                    "src",
                    "__test__"
                ],
                "tddJson": packageJson
            }
        };

        let result = helper.parse(givenArgs);
        let expectedGivenArgs = ["--help", "--test"];
        expect(givenArgs).to.be.deep.eq(expectedGivenArgs);
        expect(result).to.be.deep.eq(expectedResult);
    });
});
