/* const puzzleInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`; */

import { puzzleInput } from "./D4_0_puzzle_input";

const lines = puzzleInput.split("\n");

interface GameData {
    cardId: number;
    winningNumbers: number[];
    guessingNumbers: number[];
    wonCopies: number;

}

interface GameGuesses extends GameData {
    rightGuesses: number;
}

interface GamePointsSingle extends GameGuesses {
    points: number;
}

interface GamePointsSum extends GamePointsSingle {
    pointsSum: number;
}

function getGameDataFromLine(line: string): GameData {
    const regex = new RegExp(/^Card\s+(\d+):\s+([^|]+)\s+\|\s+([^|]+)$/, 'gm');

    const matches = regex.exec(line);
    if (!matches) {
        throw "No matches found!";
    }

    const cardId = parseInt(matches[1]);
    const winningNumbers = matches[2].trim().split(/\s+/).map(str => parseInt(str));
    const guessingNumbers = matches[3].trim().split(/\s+/).map(str => parseInt(str));

    return {
        cardId,
        winningNumbers,
        guessingNumbers,
        wonCopies: 0
    };
}

function getRightGuessesFromGame(game: GameData): GameGuesses {
    return {
        ...game,
        rightGuesses: game?.guessingNumbers
            .map(n => game.winningNumbers.indexOf(n) !== -1)
            .reduce(
                (sum, correctGuess) => {
                    return sum + (correctGuess ? 1 : 0);
                },

                0)
    };
}

function getPointsOfGame(game: GameGuesses): GamePointsSingle {
    return {
        ...game,
        points: game.rightGuesses ? Math.pow(2, game.rightGuesses - 1) : 0
    };
}


const gameWithPoints = lines.map(getGameDataFromLine)
    .map(getRightGuessesFromGame)
    .map(getPointsOfGame);

const points = gameWithPoints
    .reduce((sum, game) => {
        return sum + game.points
    }, 0);

const scratchCopyMap = gameWithPoints.reduce((map, game) => {
    map.set(game.cardId, game.points);
    return map;
}, new Map<number, number>());


/*
    1. Game: points: 2
    2. Game: points: 2, Copy 1
    3. Game: points: 2, Copy 2

*/
const gameCardCount = gameWithPoints.map(((game, index) => {
    console.log(`Card ${game.cardId}:\trightGuesses: ${game.rightGuesses}\twonCopies: ${game.wonCopies}`)
    for (let relativeIndex = 0; relativeIndex < game.rightGuesses; relativeIndex++) {
        const absoluteIndex = index + relativeIndex + 1;
        if (absoluteIndex >= gameWithPoints.length) {
            continue;
        }
        gameWithPoints[absoluteIndex].wonCopies += game.wonCopies + 1;
    }

    return {
        ...game,
        cartCount: 1 + game.wonCopies
    }
}));

const cartCount = gameCardCount
    .reduce((sum, game) => {
        return sum + game.cartCount
    }, 0);

console.log(`Total points: ${points}`);
console.log(`Total card instance count: ${cartCount}`);