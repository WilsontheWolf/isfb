const spaceRegex = /\({0,1}_+\){0,1}/g;
const dupRegex = /[[\s.?!()[\]*'",;\u200E\\]|_+(?=_)/gi; 

/**
 * Counts the number of spaces in a black card.
 * @param {string} text - The card to count spaces in.
 * @returns {number} The number of spaces in the text.
 */
const countSpaces = (text) => {
    const matches = text.match(spaceRegex) || [];
    return matches.length;
};

/**
 * Generates a string to check for duplicates.
 * @param {string} text - The text to generate a duplicate string for.
 * @returns {string} A string to check for duplicates.
 */
const genDupString = (text) => {
    return text.toLowerCase().trim().replace(dupRegex, '');
};

/**
 * Replace spaces in a black card with white cards.
 * @param {string} text - The text to replace spaces in.
 * @param {string[]} whites - The white cards to replace spaces with.
 * @returns {string} The text with spaces replaced with white cards.
 */
const replaceSpaces = (text, whites) => {
    const matches = text.match(spaceRegex) || [];
    if (matches.length > whites.length) {
        throw new Error('Not enough white cards to replace spaces.');
    }
    if(matches.length === 0) {
        return text + ' **' + whites[0] + '**';
    }
    let i = 0;
    return text.replace(spaceRegex, () => {
        const white = whites[i];
        i++;
        return `**${white}**`;
    });
};



module.exports = {
    countSpaces,
    genDupString,
    replaceSpaces,
};