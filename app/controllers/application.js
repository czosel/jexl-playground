import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { version } from "jexl/package.json";

import jexl from "jexl";

const safeEval = code => Function('"use strict";return (' + code + ")")();

export default class ApplicationController extends Controller {
  queryParams = ["input", "context", "transforms"];

  @tracked input = 'assoc[.first == "Lana"].last|greet';
  @tracked context = JSON.stringify(
    {
      name: { first: "Sterling", last: "Archer" },
      assoc: [
        { first: "Lana", last: "Kane" },
        { first: "Cyril", last: "Figgis" },
        { first: "Pam", last: "Poovey" }
      ],
      age: 36
    },
    null,
    2
  );

  @tracked transforms = `{
  greet: name => "Hi " + name
}`;

  @tracked showAst = false;

  version = version;

  get output() {
    try {
      const transforms = safeEval(this.transforms);
      Object.entries(transforms).map(([key, transform]) => {
        jexl.addTransform(key, transform);
      });

      return JSON.stringify(
        jexl.evalSync(this.input, safeEval(this.context)),
        null,
        2
      );
    } catch (e) {
      return e;
    }
  }

  get ast() {
    try {
      return JSON.stringify(
        jexl.createExpression(this.input)._getAst(),
        null,
        2
      );
    } catch (e) {
      return "";
    }
  }

  @action
  toggleAst() {
    this.showAst = !this.showAst;
  }

  @action
  clear() {
    this.input = "";
    this.context = "{}";
    this.transforms = "{}";
  }
}
