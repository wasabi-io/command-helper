import CommandHelper from "../../src/index";
import template from "./template";

let helper = new CommandHelper({
    template
});

let array = ['--renderer', '--another_command', '--debug-brk'];

let result = helper.parse(array);

console.log(result);

