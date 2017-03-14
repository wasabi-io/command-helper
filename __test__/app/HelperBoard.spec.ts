import HelperBoard from "app/HelperBoard";
import template from "../template";
import Objects from "wasabi-common/lib/types/Objects";
import Helper from "app/Helper";

describe("app/HelperBoard", () => {
    it("help", () => {

    })
    it("initTemplate", () => {
        let temp = Objects.clone(template);
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

        var props = {
            template: temp
        };
        let helperBoard = new HelperBoard(props);
        helperBoard.help(result);
    })
});