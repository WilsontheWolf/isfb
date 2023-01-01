const { cards, internal } = require('../dbs');
const { regenCachedData } = require('./caching');

const addCard = (card) => {
    let id = internal.get('cardCount');
    while(!cards.has(id)) id++;
    cards.set(id.toString(), card);
    internal.set('cardCount', id + 1);
    regenCachedData();
};

const removeCard = (id) => {
    cards.delete(id);
    regenCachedData();
};

module.exports = {
    addCard,
    removeCard,
};
