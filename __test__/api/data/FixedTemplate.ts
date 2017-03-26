import * as Readers from "api/Readers";

module.exports = {
  "name": "command-helper",
  "version": "1.0.0",
  "commands": {
    "--renderer": "renderer",
    "--interactive": "interactive",
    "--base-url": "baseUrl",
    "--root-list": "rootList",
    "--opts": "opts",
    "--tdd-json": "tddJson",
    "--files": "files",
    "--another-files": "anotherFiles",
    "--json-files": "jsonFiles"
  },
  "options": {
    "renderer": {
      "reader": {
        "name": "Boolean",
        "main": Readers.Boolean
      },
      "defaultValue": false,
      "remove": true,
      "infinity": false,
      "description": "Renderer Description",
      "usage": 0
    },
    "interactive": {
      "reader": {
        "name": "Boolean",
        "main": Readers.Boolean
      },
      "defaultValue": false,
      "remove": true,
      "infinity": false,
      "description": "Interactive Description",
      "usage": 0
    },
    "baseUrl": {
      "reader": {
        "name": "String",
        "main": Readers.String
      },
      "defaultValue": "",
      "remove": true,
      "infinity": false,
      "description": "Base Url Description",
      "usage": 1
    },
    "rootList": {
      "reader": {
        "name": "Array",
        "main": Readers.Array
      },
      "defaultValue": [],
      "remove": true,
      "infinity": false,
      "description": "Root List Description",
      "usage": -1
    },
    "opts": {
      "reader": {
        "name": "TextFile",
        "main": Readers.TextFile
      },
      "defaultValue": "",
      "remove": true,
      "infinity": false,
      "description": "Opts Description",
      "usage": 1
    },
    "tddJson": {
      "reader": {
        "name": "JsonFile",
        "main": Readers.JsonFile
      },
      "defaultValue": {},
      "remove": true,
      "infinity": false,
      "description": "Tdd Json Description",
      "usage": 1
    },
    "files": {
      "reader": {
        "name": "Array<TextFile>",
        "main": Readers.Array,
        "related": Readers.TextFile
      },
      "defaultValue": [],
      "remove": true,
      "infinity": false,
      "description": "Files Description",
      "usage": -1
    },
    "jsonFiles": {
      "reader": {
        "name": "Array<JsonFile>",
        "main": Readers.Array,
        "related": Readers.JsonFile
      },
      "defaultValue": [],
      "remove": true,
      "infinity": false,
      "description": "Json Files Description",
      "usage": -1
    }
  },
  readers: Readers
};

