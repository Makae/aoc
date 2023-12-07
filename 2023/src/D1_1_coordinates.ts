import { coordinateData } from "./D1_1_coordinate-data";


const numberMap: { [key: string]: number } = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
};

let numberMapReversed: { [key: string]: number } = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "eno": 1,
    "owt": 2,
    "eerht": 3,
    "ruof": 4,
    "evif": 5,
    "xis": 6,
    "neves": 7,
    "thgie": 8,
    "enin": 9,
};

const keys = Object.keys(numberMap);
const keysReversed = Object.keys(numberMapReversed);

const keysConcated = "(" + keys.join(")|(") + ")";
const keysConcatedReversed = "(" + keysReversed.join(")|(") + ")";

const numberRegex = new RegExp(`${keysConcated}`, 'g');
const numberRegexReversed = new RegExp(`${keysConcatedReversed}`, 'g');


function findFirstValue(line: string, regex: RegExp) {
    const matches = line.match(regex);
    if (!matches) {
        throw `Cannot get matches for line: ${line}`;
    }
    return matches[0] as string;
}

let sum = 0;
const lines = coordinateData.split("\n");
for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const lineReversed = line.split("").reverse().join("");

    const firstStr = findFirstValue(line, numberRegex);
    const lastStr = findFirstValue(lineReversed, numberRegexReversed);

    const first = numberMap[firstStr];
    const last = numberMapReversed[lastStr];

    const number = parseInt(`${first}${last}`);
    console.log(``);
    console.log(`idx=${index}`);
    console.log(`lnn=${line}`);
    console.log(`lnr=${lineReversed}`);
    console.log(`stf=${firstStr}`);
    console.log(`stl=${lastStr}`);
    console.log(`fsr=${first}`);
    console.log(`ssr=${last}`);
    console.log(`ttlr=${number}`);
    sum += number;
}

console.log(`The solution = ${sum}`);