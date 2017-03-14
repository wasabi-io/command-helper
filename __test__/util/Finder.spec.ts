import Finder from "util/Finder";
import {CommandState} from "app/HelperApi";
import { HelperTemplate } from "app/HelperApi";
import template from "../template";
import { expect } from "chai";

describe("util/Finder", () => {
    it("getOne", () => {
        let argv = ["--deneme", "example", "-deneme2=example"];
        let state: any = {
            argv,
            lastIndex: 0
        };
        let expectedResult = "example";
        expect(Finder.getOne(state)).to.be.eq(expectedResult);
        state.part2 = "example";
        expect(Finder.getOne(state)).to.be.eq(expectedResult);
    });

    it("getList", () => {
        let argv = ["--command1", "value1", "value2", "-command2", "value3", "value4"];
        let state: any = {
            argv,
            lastIndex: 0
        };
        let expectedResult = ["value1", "value2"];
        expect(Finder.getList(state)).to.be.deep.eq(expectedResult);
        state.lastIndex++;
        expectedResult = ["value3", "value4"];
        expect(Finder.getList(state)).to.be.deep.eq(expectedResult);
    })
});