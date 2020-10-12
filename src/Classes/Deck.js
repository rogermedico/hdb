export class Deck {
    constructor() {
        this._id = this._uuidv4();
        this._name = 'New deck';
        this._cards = [];
    }

    _uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
        );
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get cards() {
        return this._cards;
    }

    addCard(card) {
        this._cards.push(card);
    }

    removeCard(cardId) {
        this._cards = this._cards.filter(cardsInDeck => cardsInDeck.cardId !== cardId);
    }

    get nCards() {
        return this._cards.length;
    }
}