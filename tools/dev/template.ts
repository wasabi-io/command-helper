const packageJson = require("../../package.json");
let template = {
  name: "application",
  version: "v1.0",
  options: {
    "--renderer": {
      "type": "boolean",
      "usage": 0,
      "default": false,
      "description": "show view on ui"
    },
    "--interactive": {
      "type": "boolean",
      "usage": 0,
      "default": false,
      "description": "show view in watch mode"
    },
    "--root-list": {
      "type": "array",
      "default": [],
      "usage": -1,
      "infinity": true,
      "description": "provides to resolve file in root folders"
    },
    "--debug-brk": {
      "type": "boolean",
      "default": false,
      "usage": 0,
      "remove": true,
      "description": "run program in debug mode"
    }
  }
};
export default template;
