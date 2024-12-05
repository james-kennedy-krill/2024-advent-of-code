import * as fs from "fs";

const data = fs.readFileSync("./day3-input.txt", "utf-8");

const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
const matches = [...data.matchAll(regex)];

const reducer = (total: number, match: string[]) =>
  (total += Number(match[1]) * Number(match[2]));

console.log("Puzzle 1: ", matches.reduce(reducer, 0));

const first_regex = /^(.*?)(?=do|don't)/g;
const first_matches = [...data.matchAll(first_regex)];
const do_regex = /(?:do\(\)).*?don't\(\)/g;
const do_matches = [...data.matchAll(do_regex)];

let puz_2_total = 0;
first_matches.forEach((match) => {
  const mul_matches = [...match[0].matchAll(regex)];
  puz_2_total += mul_matches.reduce(reducer, 0);
});
do_matches.forEach((match) => {
  const mul_matches = [...match[0].matchAll(regex)];
  puz_2_total += mul_matches.reduce(reducer, 0);
});
console.log("Puzzle 2:", puz_2_total);
