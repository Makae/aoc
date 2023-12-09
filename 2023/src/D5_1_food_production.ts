
import { seeds, mappings, RangeSet, mapOrder } from "./D5_0_puzzle_input";

function myFlatMap<T>(existing: any[], current: any[][]): T[] {
    return existing.concat(current);
};

const getDestinationValue = (value: number, rangeSet: RangeSet): number => {
    const rangeMapping = rangeSet.rangeMappings.find((entry) => {
        return entry.srcFrom <= value && value <= entry.srcTo;
    })

    if (!rangeMapping) {
        return value;
    }

    const offset = value - rangeMapping.srcFrom;
    return rangeMapping.dstFrom + offset;

}

type AlmanacEntry = [string, number, number];



const result = seeds.map((seed) => {
    let previousValue = seed;
    return mapOrder.map(mapKey => {
        if(mappings.has(mapKey)) {
            throw `Cannot find map for ${mapKey}`
        }
        const dstValue = getDestinationValue(previousValue, mappings.get(mapKey)!);

        previousValue = dstValue;
        return [mapKey, previousValue, dstValue];
    });
});

console.log(result);
/* 
const almanac = seeds.map(seed => {
    return [...mappings.values()].map((value): AlmanacEntry => {
        return [value.name, seed, getDestinationValue(seed, value)];
    });
})
    .reduce(myFlatMap<AlmanacEntry>, [])
    .reduce((map, [mapName, srcValue, dstValue]) => {
        if (!map.has(mapName)) {
            map.set(mapName, new Map<number, number>());
        }

        map.get(mapName).put(srcValue, dstValue);

        return map;
    }, new Map<string, Map<number, number>>());

 */