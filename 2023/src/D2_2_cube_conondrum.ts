import { games } from "./D2_1_puzzle_input";


const lines = games.split("\n");
const colorLimits = {
    "red": 12,
    "green": 13,
    "blue": 14,
}



function getGameId(wholeGameLine: string): string {
    return wholeGameLine.split(":")[0].split(" ")[1];
}

function getDrawsAsStrings(wholeGameLine: string) {
    return wholeGameLine.split(":")[1].split(";");
}

function getSingleColorDraws(allDraws: string) {
    return allDraws.split(",");
}

type ColorDrawMap = { [key: string]: number; };

const gameData = lines
    .map(line => {
        return {
            gameId: getGameId(line),
            drawData: getDrawsAsStrings(line)
                .map(draw => getSingleColorDraws(draw)
                    .map((colorCount) => colorCount.trim().split(" "))
                    .reduce((drawMap: ColorDrawMap, [count, color]) => {
                        drawMap[color as string] = !count ? 0 : parseInt(count);
                        return drawMap;
                    }, { red: 0, blue: 0, green: 0 })),
            valid: true
        }
    });


// D1_1:
gameData.forEach(game => {
    const gameId = game.gameId;
    game.drawData.forEach((drawMap, idx) => {
        const drawIsValid = drawMap.red <= colorLimits.red &&
            drawMap.blue <= colorLimits.blue &&
            drawMap.green <= colorLimits.green;
        game.valid = game.valid && drawIsValid;

        // console.log(`GameId:${gameId}, draw:${idx + 1}, isValid: ${drawIsValid} | red:${drawMap.red}, green:${drawMap.green}, blue:${drawMap.blue}`)
    });
    // console.log("");
});


console.log(`Count are invalid: ${gameData.filter(g => !g.valid).length}`);

const idSum = gameData.filter(g => g.valid)
    .reduce((idSum, game) => {
        idSum += parseInt(game.gameId);
        return idSum;
    }, 0)

console.log(`ID sum = ${idSum}`)




//D2_2
const gamePowers = gameData.map(game => {
    const minCubes = game.drawData.reduce((minCubes, currentDraw) => {
        minCubes.red = minCubes.red > currentDraw.red ? minCubes.red : currentDraw.red;
        minCubes.green = minCubes.green > currentDraw.green ? minCubes.green : currentDraw.green;
        minCubes.blue = minCubes.blue > currentDraw.blue ? minCubes.blue : currentDraw.blue;
        return minCubes;
    },
        { red: 0, blue: 0, green: 0 });


    const power = minCubes.red * minCubes.green * minCubes.blue;
    if (power === 0) {
        console.warn(game);
    }

    return power;
});

const powerSum = gamePowers.reduce((sum, current) => sum + current, 0);

console.log(`Solution D2_2=${powerSum}`);

