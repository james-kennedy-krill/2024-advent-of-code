import * as fs from "fs";

const data = fs.readFileSync("day5-input.txt", "utf-8");
const data_split = data.split("\n\n");

// First are the page ordering rules: X|Y (one per line)
// If X and Y are both present, X must come before Y
const page_order_rules = data_split[0]
  .split("\n")
  .map((rule) => rule.split("|").map((rule_value) => Number(rule_value)));

// Second section is page numbers of each update (one per line)
// Determine which lines are correct (pass the rules)
// Then grab the "middle" digit
// then add all the middle digits together
const updates = data_split[1]
  .split("\n")
  .map((update) => update.split(",").map((page) => Number(page)));

function check_rules(
  _page: number,
  _update: number[],
  _page_order_rules: number[][]
): boolean {
  const filtered_rules = _page_order_rules.filter((rule) => rule[0] === _page);
  const page_passes_rules = filtered_rules.every((rule) => {
    if (_update.includes(rule[1])) {
      const rule_page_index = _update.indexOf(rule[1]);
      const page_index = _update.indexOf(_page);
      return page_index < rule_page_index;
    }
    return true;
  });
  return page_passes_rules;
}

console.log(
  "Puzzle 1: ",
  updates.reduce((total: number, update: number[]) => {
    const passes = update.every((page) => {
      return check_rules(page, update, page_order_rules);
    });
    if (passes) {
      const middle = Math.floor(update.length / 2);
      total += update[middle];
    }
    return total;
  }, 0)
);

function fix_update(_update: number[]): number[] {
  // TODO probably some kind of custom sort function
  // we need to fix the order of the array
  _update.sort((a, b) => {
    console.log(a, b);
    if (check_rules(b, [a, b], page_order_rules)) {
      return -1;
    } else {
      return 1;
    }
  });
  console.log("fixed update: ", _update);
  return _update;
}

console.log(
  "Puzzle 2: ",
  updates
    .filter(
      (update: number[]) =>
        !update.every((page) => check_rules(page, update, page_order_rules))
    )
    .reduce((total: number, update: number[]) => {
      console.log("original update:", update);
      const fixed_update = fix_update(update);
      const middle = Math.floor(fixed_update.length / 2);
      total += fixed_update[middle];
      return total;
    }, 0)
);
