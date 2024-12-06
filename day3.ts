import * as fs from "fs";

const data = fs.readFileSync("./day3-input.txt", "utf-8");
// const data = fs.readFileSync("./day3-sample2.txt", "utf-8");

const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
const matches = [...data.matchAll(regex)];

const reducer = (total: number, match: string[]) =>
  (total += Number(match[1]) * Number(match[2]));

console.log("Puzzle 1: ", matches.reduce(reducer, 0));

const data2 = data.replace("\n", " ").replace("\r", " ");
// console.log(data2);

const first_regex = /^(.*?)(?=don't)/g;
const first_matches = [...data2.matchAll(first_regex)];
// console.log(first_matches);
const do_regex = /(?:do\(\))(.*)(?:don't\(\))/g;
const do_matches = [...data2.matchAll(do_regex)];
// console.log(do_matches);
const end_regex = /(?:do\(\))(.*)(?!don't)$/g;
const end_matches = [...data2.matchAll(end_regex)];
// console.log(end_matches);

let puz_2_total = 0;
first_matches.forEach((match) => {
  const mul_matches = [...match[1].matchAll(regex)];
  // console.log(mul_matches);
  puz_2_total += mul_matches.reduce(reducer, 0);
});
console.log(puz_2_total);
// console.log(do_matches);
do_matches.forEach((match) => {
  const mul_matches = [...match[1].matchAll(regex)];
  // console.log(mul_matches);
  puz_2_total += mul_matches.reduce(reducer, 0);
});
console.log(puz_2_total);
end_matches.forEach((match) => {
  const mul_matches = [...match[1].matchAll(regex)];
  puz_2_total += mul_matches.reduce(reducer, 0);
});

console.log("Puzzle 2:", puz_2_total);
console.log("88802350");
