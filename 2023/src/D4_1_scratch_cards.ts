/* const puzzleInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`; */

import { puzzleInput } from "./D4_0_puzzle_input";

const lines = puzzleInput.split("\n");

interface GameData {
    cardId: string;
    winningNumbers: number[];
    guessingNumbers: number[];
}

interface GameResult extends GameData {
    rightGuesses: number | undefined;
}

interface GamePoints extends GameResult {
    points: number;
}

function getGameDataFromLine(line: string): GameData {
    const regex = new RegExp(/^Card\s+(\d+):\s+([^|]+)\s+\|\s+([^|]+)$/, 'gm');

    const matches = regex.exec(line);
    if (!matches) {
        throw "No matches found!";
    }

    const cardId = matches[1];
    const winningNumbers = matches[2].trim().split(/\s+/).map(str => parseInt(str));
    const guessingNumbers = matches[3].trim().split(/\s+/).map(str => parseInt(str));

    return {
        cardId,
        winningNumbers,
        guessingNumbers
    };
}

function getRightGuessesFromGame(game: GameData): GameResult {
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

function getPointsOfGame(game: GameResult): GamePoints {
    return {
        ...game,
        points: game.rightGuesses ? Math.pow(2, game.rightGuesses - 1) : 0
    };
}


const points = lines.map(getGameDataFromLine)
    .map(getRightGuessesFromGame)
    .map(getPointsOfGame)
    .reduce((sum, game) => { return sum + game.points }, 0);



console.log(`Total points:${points}`);