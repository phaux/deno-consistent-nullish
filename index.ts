import { eqNullishLooseRule } from "./rules/eq-nullish-loose.ts";
import { noDefaultValRule } from "./rules/no-default-val.ts";
import { noInOperatorRule } from "./rules/no-in-operator.ts";
import { noUnsafeSpreadRule } from "./rules/no-unsafe-spread.ts";
import { optPropUndefRule } from "./rules/opt-prop-undef.ts";

const nullishPlugin = {
  name: "prosto-nullish",
  rules: {
    "eq-nullish-loose": eqNullishLooseRule,
    "no-default-val": noDefaultValRule,
    "no-in-operator": noInOperatorRule,
    "no-unsafe-spread": noUnsafeSpreadRule,
    "opt-prop-undef": optPropUndefRule,
  },
} satisfies Deno.lint.Plugin;

export default nullishPlugin;
