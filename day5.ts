import * as fs from "fs";

const data = fs.readFileSync("day5-input.txt", "utf-8");

// First are the page ordering rules: X|Y (one per line)
// If X and Y are both present, X must come before Y
const page_ordering_rules = ["89|27", "27|29"]; // TODO get this from data

// Second section is page numbers of each update (one per line)
// Determine which lines are correct (pass the rules)
// Then grab the "middle" digit
// then add all the middle digits together
const updates = ["75,47,61,53"];

// Notes:
/**
 * Turn page_ordering_rules into an array of arrays?
 * [[89,27], [27, 29]]
 *
 * arrays of objects?
 * [{
 *   x: 89,
 *   y: 27
 * },
 * {
 *   x: 27,
 *   Y: 29
 * }]
 */

updates.reduce((total: number, update: string) => {
  // validate each number in the update
  // if it passes the rules, find the middle number

  return total;
}, 0);
