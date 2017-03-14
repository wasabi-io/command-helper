import { addModule } from "wasabi-common/lib/util/Resolver";
addModule("src");
import Helper from "app/Helper";
import template from "./template";

let helper = new Helper({
    template
});

let array = ['--renderer', '--another_command', '--debug-brk'];

let result = helper.parse(array);

console.log(result);

