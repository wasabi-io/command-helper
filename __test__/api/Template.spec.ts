import Template from "api/Template";
import { expect } from "chai";
const FixedTemplate = require("./data/FixedTemplate");
const template = require("./data/template.json");

describe("api/Template", () => {
    it("fixTemplate", () => {
        let fixedTemplate = Template.fixTemplate(template);
        expect(fixedTemplate).to.be.deep.eq(FixedTemplate);
    })
});