import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

import jexl from "jexl";

const safeEval = code => Function('"use strict";return (' + code + ")")();

export default class ApplicationController extends Controller {
  queryParams = ["input", "context"];

  @tracked input = 'assoc[.first == "Lana"].last';
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

  @tracked showAst = false;

  get output() {
    try {
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
  }
}
