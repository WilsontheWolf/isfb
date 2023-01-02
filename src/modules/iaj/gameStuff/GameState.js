const { states } = require('./gameEnums');

class GameState {
    constructor(owner, id) {
        /** @type {string} */
        this.owner = owner;
        /** @type {string} */
        this.id = id;
        /** @type {number} */
        this.state = states.WAITING;
        /** @type {[]} */
        this.players = [];
        /** @type {{value: string, owner: string, type: 'black'}?} */
        this.currentBlackCard = null;
        /** @type {{value: string, owner: string, type: 'black'}[]} */
        this.blackDeck = [];
        /** @type {{value: string, owner: string, type: 'white'}[]} */
        this.whiteDeck = [];
    }

}

module.exports = GameState;