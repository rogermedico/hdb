import { ENDPOINTS } from '../utils/endpoints';

export class Card {
    constructor(cardId, cardSet, type, faction, rarity, race, playerClass) {
        /* Basic attributes */
        this._cardId = cardId;
        this._cardSet = cardSet;
        this._type = type;
        this._faction = faction;
        this._rarity = rarity;
        this._race = race;
        this._img = this._buildImgUrl(cardId);
        this._playerClass = playerClass;

        /* Extended attributes */
        this._name = undefined;
        this._cost = undefined;
        this._attack = undefined;
        this._health = undefined;
        this._text = undefined;
        this._flavor = undefined;
        this._artist = undefined;
        this._collectible = undefined;
        this._elite = undefined;
        this._locale = undefined;
        this._infoCompleted = false;
    }

    /* Builds img url based into endpoint info */
    _buildImgUrl(cardId) {
        return ENDPOINTS.IMG + cardId + '.png';
    }

    /* returns boolean if the card has all fields */
    get infoCompleted() {
        return this._infoCompleted;
    }

    set infoCompleted(infoCompleted) {
        this._infoCompleted = infoCompleted;
    }

    get cardId() {
        return this._cardId;
    }

    // set cardId(cardId) {
    //     this._cardId = cardId;
    // }

    get playerClass() {
        return this._playerClass;
    }

    // set playerClass(playerClass) {
    //     this._playerClass = playerClass;
    // }

    get cardSet() {
        return this._cardSet;
    }

    // set cardSet(cardSet) {
    //     this._cardSet = cardSet;
    // }

    get type() {
        return this._type;
    }

    // set type(type) {
    //     this._type = type;
    // }

    get faction() {
        return this._faction;
    }

    set faction(faction) {
        this._faction = faction;
    }

    get rarity() {
        return this._rarity;
    }

    set rarity(rarity) {
        this._rarity = rarity;
    }

    get race() {
        return this._race;
    }

    set race(race) {
        this._race = race;
    }

    get img() {
        return this._img;
    }

    set img(image) {
        this._img = image;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get cost() {
        return this._cost;
    }

    set cost(cost) {
        this._cost = cost;
    }

    get attack() {
        return this._attack;
    }

    set attack(attack) {
        this._attack = attack;
    }

    get health() {
        return this._health;
    }

    set health(health) {
        this._health = health;
    }

    get text() {
        return this._text;
    }

    set text(text) {
        this._text = text;
    }

    get flavor() {
        return this._flavor;
    }

    set flavor(flavor) {
        this._flavor = flavor;
    }

    get artist() {
        return this._artist;
    }

    set artist(artist) {
        this._artist = artist;
    }

    get collectible() {
        return this._collectible;
    }

    set collectible(collectible) {
        this._collectible = collectible;
    }

    get elite() {
        return this._elite;
    }

    set elite(elite) {
        this._elite = elite;
    }

    get locale() {
        return this._locale;
    }

    set locale(locale) {
        this._locale = locale;
    }

    /* returns an object with all properties that have some value */
    getAllProperties() {
        const info = {};
        if (this._cardId) info['Card id'] = this._cardId;
        if (this._playerClass) info['Player class'] = this._playerClass;
        if (this._cardSet) info['Card set'] = this._cardSet;
        if (this._type) info['Type'] = this._type;
        if (this._faction) info['Faction'] = this._faction;
        if (this._rarity) info['Rarity'] = this._rarity;
        if (this._race) info['Race'] = this._race;

        if (this._name) info['Name'] = this._name;
        if (this._cost) info['Cost'] = this._cost;
        if (this._attack) info['Attack'] = this._attack;
        if (this._health) info['Health'] = this._health;
        if (this._text) info['Text'] = this._text;
        if (this._flavor) info['Flavor'] = this._flavor;
        if (this._artist) info['Artist'] = this._artist;
        if (this._elite) info['Elite'] = this._elite;

        return info;
    }
}