const { cards } = require('../dbs');
const { countSpaces, genDupString } = require('./parsing');

let cachedData = null;
/**
 * Regenerates the cached data.
 */
const regenCachedData = () => {
    cachedData = {
        black: [],
        white: [],
        uniqueSpaces: 0,
        combos: 0,
        duplicateStrings: {
            white: {},
            black: {},
        },
    };
    cards.forEach((c, i) => {
        if (c.type === 'white') cachedData.white.push(i);
        if (c.type === 'black') {
            cachedData.black.push(i);
            cachedData.uniqueSpaces += countSpaces(c.value) || 1;
        }
        cachedData.duplicateStrings[c.type][i] = genDupString(c.value);
        // const dups = Object.entries(cachedData.duplicateStrings[c.type]).filter(([,v]) => v === cachedData.duplicateStrings[c.type][i]);
        // if(dups.length > 1) console.log(`Duplicate card found: ${genDupString(c.value)} ${dups.map(([k]) => `${k}: ${cards.get(k).value}`).join(', ')}`);
    });
    cachedData.combos = cachedData.uniqueSpaces * cachedData.white.length;

};

/**
 * Returns the cached data, and generates it if it doesn't exist.
 * @returns {Object} The cached data.
 */
const getCachedData = () => {
    if (cachedData) return cachedData;
    regenCachedData();
    return cachedData;
};

/**
 * Checks for duplicates of a card.
 * @param {String} type The type of card to check for duplicates of.
 * @param {String} value The value of the card to check for duplicates of.
 * @returns {Boolean} Whether there is a dup or not.
 */
const checkForDuplicates = (type, value) => {
    const dupString = genDupString(value);
    const dups = Object.entries(getCachedData().duplicateStrings[type]).findIndex(([, v]) => v === dupString);
    return dups > -1;
};

module.exports = {
    getCachedData,
    regenCachedData,
    checkForDuplicates,
};