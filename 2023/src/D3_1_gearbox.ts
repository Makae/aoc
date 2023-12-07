import { puzzleInput } from "./D3_0_puzzle_input";
/* const puzzleInput = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;
 */
interface Kernel { width: number; height: number; data: string[][], };

const getLineValue = (line: string[], xMin: number, xMax: number) => {
    return [
        line[xMin],
        line[xMin + 1],
        line[xMin + 2],
        line[xMin + 3],
        line[xMax - 2],
        line[xMax - 1],
        line[xMax],
    ]
}

const getKernel = (previousLine: string[], currentLine: string[], nextLine: string[], charIdx = 0): Kernel => {
    const xMin = charIdx - 3;
    const xMax = charIdx + 3;
    const data = [
        getLineValue(previousLine, xMin, xMax),
        getLineValue(currentLine, xMin, xMax),
        getLineValue(nextLine, xMin, xMax)
    ];



    return {
        width: data[0].length,
        height: data.length,
        data
    }
}

const isNumber = (str: string): boolean => !!str.match(/^[0-9]+$/);
const isSymbol = (str: string) => !isNumber(str) && str !== ".";

const isKernelNumberAdjacentToSymbol = (kernel: Kernel) => {
    const numberCoords = getNumberCoordsOnKernelCenter(kernel.data);
    const first = numberCoords[0];
    const last = numberCoords[numberCoords.length - 1];

    // Check horizontal
    const kernelLine = kernel.data[1];
    if (isSymbol(kernelLine[first - 1]) || isSymbol(kernelLine[last + 1])) {
        return true;
    }
    // Check vertical
    for (const xCoord of numberCoords) {
        if (isSymbol(kernel.data[0][xCoord]) || isSymbol(kernel.data[2][xCoord])) {
            return true;
        }
    }

    // Check corners
    if (isSymbol(kernel.data[0][first - 1]) || isSymbol(kernel.data[0][last + 1])) {
        return true;
    }
    if (isSymbol(kernel.data[2][first - 1]) || isSymbol(kernel.data[2][last + 1])) {
        return true;
    }
    return false;
}

const isKernelOnGear = (kernel: Kernel) => {
    return kernel.data[1][3] === "*";
}

const getNumberCoordsOnKernelCenter = (data: string[][]): number[] => {
    const kernelLine = data[1];
    // The very center needs to be a number
    if (!isNumber(kernelLine[2])) {
        return [];
    }

    // Case: .111.
    if (isNumber(kernelLine[1] + kernelLine[2] + kernelLine[3])) {
        return [1, 2, 3];
    }

    // Case: ..11.
    if (!isNumber(kernelLine[1]) && isNumber(kernelLine[2] + kernelLine[3]) && !isNumber(kernelLine[4])) {
        return [2, 3];
    }

    // Case: ..1..
    if (!isNumber(kernelLine[1]) && isNumber(kernelLine[2]) && !isNumber(kernelLine[3])) {
        return [2];
    }

    // All other cases
    return [];
}

const getKernelNumber = (kernel: Kernel): number | null => {
    const numberCoords = getNumberCoordsOnKernelCenter(kernel.data);

    if (!numberCoords.length) {
        return null;
    }

    if (!isKernelNumberAdjacentToSymbol(kernel)) {
        return null;
    }


    let concatedNumber = "";
    for (const xCoord of numberCoords) {
        concatedNumber += kernel.data[1][xCoord];
    }

    return parseInt(concatedNumber);
}

const getCellValue = (kernel: Kernel, yxPointer: number[]): string => {
    return kernel.data[yxPointer[0]][yxPointer[1]];
}

const findNumberAtPosition = (kernel: Kernel, yxPointer: number[]): number => {
    const leftPointer = [yxPointer[0], yxPointer[1] - 1];
    const rightPointer = [yxPointer[0], yxPointer[1] + 1];

    let concatedNumber = getCellValue(kernel, yxPointer);
    for (let cellValue = getCellValue(kernel, leftPointer); leftPointer[1] >= 0 && isNumber(cellValue); leftPointer[1]--, cellValue = getCellValue(kernel, leftPointer)) {
        concatedNumber = cellValue + concatedNumber;
    }

    for (let cellValue = getCellValue(kernel, rightPointer); rightPointer[1] < kernel.width && isNumber(cellValue); rightPointer[1]++, cellValue = getCellValue(kernel, rightPointer)) {
        concatedNumber = concatedNumber + cellValue;
    }

    return parseInt(concatedNumber);
}

const getGearRatio = (kernel: Kernel): number | null => {
    if (!isKernelOnGear(kernel)) {
        return null;
    }

    const horizontalCenter = 3;
    const firstLine = kernel.data[0];
    const centerLine = kernel.data[1];
    const lastLine = kernel.data[2];
    const gearSourrounding = [
        [isNumber(firstLine[horizontalCenter - 1]), isNumber(firstLine[horizontalCenter]), isNumber(firstLine[horizontalCenter + 1])],
        [isNumber(centerLine[horizontalCenter - 1]), false, isNumber(centerLine[horizontalCenter + 1])],
        [isNumber(lastLine[horizontalCenter - 1]), isNumber(lastLine[horizontalCenter]), isNumber(lastLine[horizontalCenter + 1])]
    ];

    // 0123456 -> index in line
    // ...x... -> kernel center = 3
    // ..012.. -> xPos -> Offset of -1
    const left = horizontalCenter - 1 + 0;
    const center = horizontalCenter - 1 + 1;
    const right = horizontalCenter - 1 + 2;

    const numberCoordinates: number[][] = [];
    for (let linePos = 0; linePos < gearSourrounding.length; linePos++) {
        const line = gearSourrounding[linePos];

        // Center: .x. ->  | .1. | 12. | .12 | 123
        if (line[1]) {
            numberCoordinates.push([linePos, center]);
            continue;
        }

        // Left: x.. => | 1..
        if (line[0]) {
            numberCoordinates.push([linePos, left]);
        }

        // Right: ..x => | ..1
        if (line[2]) {
            numberCoordinates.push([linePos, right]);
        }

    }

    if (numberCoordinates.length === 0) {
        console.log("NO gear found");
        return null;
    }

    if (numberCoordinates.length === 1) {
        console.log("Only one gear found")
        return null;
    }

    if (numberCoordinates.length > 2) {
        console.warn(`Too many gears found: ${numberCoordinates.length}`)
        return null;
    }

    const firstGearNumber = findNumberAtPosition(kernel, numberCoordinates[0]);
    const secondGearNumber = findNumberAtPosition(kernel, numberCoordinates[1]);

    console.log(`firstGearNumber: ${firstGearNumber}`)
    console.log(`secondGearNumber: ${secondGearNumber}`)
    return firstGearNumber * secondGearNumber;
    /*
        [ ][ ][ ]
        [ ][*][ ]
        [ ][ ][ ]
    */
    /*
        Case 1 - on same line:
        | [x][ ][x] | [ ][ ][ ] | [ ][ ][ ] | 123.123 | ....... | ....... 
        | [ ][*][ ] | [x][*][x] | [ ][*][ ] | ...*... | ..3*123 | ...*...
        | [ ][ ][ ] | [ ][ ][ ] | [x][ ][x] | ....... | ....... | ..3.1..
    */

    /*
        Case 2 - Corners: bottom-Left + top-Right
        | [ ][ ][x] | [x][ ][ ] | [ ][ ][x] | 123.123 | ..3.123 | ..3.1..
        | [ ][*][ ] | [ ][*][ ] | [ ][*][ ] | ...*... | ...*... | ...*...
        | [x][ ][ ] | [x][ ][ ] | [x][ ][ ] | ....... | ....... | ....... 
    */

    /*
Case 3 - above: bottom-Left + top-Right
| [ ][x][ ]  | ...1... | .123...
| [ ][*][ ]  | ...*... | ...*...
| [ ][x][ ]  | ..12... | ...123.
*/

}

// Add borders
const lines = puzzleInput.split("\n").map(line => ("..." + line + "...").split(""));
lines.unshift(Array(lines[0].length).fill("."));
lines.push(Array(lines[0].length).fill("."));

let previousLine, nextLine: string[];
let currentLine: string[];

let output = "";

let partSum = 0;
let gearRatioSum = 0;
// Stay within borders
for (let lineIdx = 1; lineIdx < lines.length - 1; lineIdx++) {
    previousLine = lines[lineIdx - 1];
    currentLine = lines[lineIdx];
    nextLine = lines[lineIdx + 1];

    for (let charIdx = 2; charIdx < currentLine.length - 2; charIdx++) {
        const kernel = getKernel(previousLine, currentLine, nextLine, charIdx);




        const kernelNumber = getKernelNumber(kernel);
        const gearRatio = getGearRatio(kernel);
        if (gearRatio !== null) {
            gearRatioSum += gearRatio
        }

        if (kernelNumber === null) {
            output += "_";
            continue;
        } else {
            partSum += kernelNumber;
        }

        output += kernelNumber ? kernelNumber : "_";

    }

    output += "\n";
}

console.log(output);
console.log(`Part Sum: ${partSum}`);
console.log(`Gear Ratio Sum: ${gearRatioSum}`);