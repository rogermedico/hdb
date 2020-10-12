import {
    requestCardByCardId,
    requestCardsByPlayerClass,
    requestCardsByCardSet,
    requestCardsByType,
    requestCardsByFaction,
    requestCardsByRarity,
    requestCardsByRace
} from '../utils/api';
import { Card } from '../Classes/Card';
import { Deck } from './Deck';

export class DeckBuilder {
    constructor(playerClasses, cardSets, types, factions, rarities, races, patch) {
        /* To store the general info of the game (filters and patch) */
        this._playerClasses = playerClasses;
        this._cardSets = cardSets;
        this._types = types;
        this._factions = factions;
        this._rarities = rarities;
        this._races = races;
        this._patch = patch;

        /* Cards already pulled from endpoint and stored locally */
        this._cardsCache = [];
        this._cardsNoImageCache = []; // not used now but who knows...

        /* To keep the calls already done to endpoints */
        this._callsDone = {
            cardId: [],
            playerClass: [],
            cardSet: [],
            type: [],
            faction: [],
            rarity: [],
            race: []
        };

        /* To store the cards shown in the middle of the screen */
        this._cardsShown = [];

        /* To store the cards that are included in the deck probably*/
        this._decks = {
            /* active deck */
            activeDeck: undefined,
            /* all decks */
            decks: []
        };

        /* To keep track the filters aplied to cardsShown */
        this._filtersObject = {
            filtersApplied: {
                playerClass: false,
                cardSet: false,
                type: false,
                faction: false,
                rarity: false,
                race: false
            },
            /* first filter applied to avoid unnecessary calls */
            firstFilter: undefined
        };

        /* retrieve info stored in browser if available */
        this._getBrowserInfo();
    }

    /* retrieve info stored into the browser */
    _getBrowserInfo() {
        /* if we are in the same patch means nothing changed so we can retrieve info securely */
        if (JSON.parse(localStorage.getItem('HearthstoneDeckBuilderPatch')) === this._patch) {
            // console.log('Same patch, load resources from browser if any');
            const browserDecks = JSON.parse(localStorage.getItem('HearthstoneDeckBuilderDecks'));
            const browserCallsDone = JSON.parse(localStorage.getItem('HearthstoneDeckBuilderCallsDone'));
            const browserCardsNoImageCache = JSON.parse(
                localStorage.getItem('HearthstoneDeckBuilderCardsNoImageCache')
            );
            const browserCardsCache = JSON.parse(
                localStorage.getItem('HearthstoneDeckBuilderCardsCache')
            );

            /* info about calls done and cached cards */
            if (browserCallsDone && browserCardsCache && browserCardsNoImageCache) {
                /* retrieve calls done */
                this._callsDone = browserCallsDone;

                /* retrieve cards cache, we have to create new objects because getters and setters are not saved */
                browserCardsCache.forEach(card => {
                    const newCard = new Card(
                        card._cardId,
                        card._cardSet,
                        card._type,
                        card._faction,
                        card._rarity,
                        card._race,
                        card._playerClass
                    );

                    newCard.name = card._name;
                    newCard.cost = card._cost;
                    newCard.attack = card._attack;
                    newCard.health = card._health;
                    newCard.text = card._text;
                    newCard.flavor = card._flavor;
                    newCard.artist = card._artist;
                    newCard.collectible = card._collectible;
                    newCard.elite = card._elite;
                    newCard.locale = card._locale;
                    newCard.infoCompleted = card._infoCompleted;

                    this._cardsCache.push(newCard);
                });

                /* same with cards without image */
                browserCardsNoImageCache.forEach(card => {
                    const newCard = new Card(
                        card._cardId,
                        card._cardSet,
                        card._type,
                        card._faction,
                        card._rarity,
                        card._race,
                        card._playerClass
                    );
                    newCard.img = 'no-img-available';
                    newCard.name = card._name;
                    newCard.cost = card._cost;
                    newCard.attack = card._attack;
                    newCard.health = card._health;
                    newCard.text = card._text;
                    newCard.flavor = card._flavor;
                    newCard.artist = card._artist;
                    newCard.collectible = card._collectible;
                    newCard.elite = card._elite;
                    newCard.locale = card._locale;
                    newCard.infoCompleted = card._infoCompleted;
                    this._cardsNoImageCache.push(newCard);
                });

                /* if info about decks */
                if (browserDecks) {
                    /* for each deck get his info and create new Deck objects to populate this._decks object */
                    for (const deck of browserDecks) {
                        const newDeck = new Deck();
                        newDeck.name = deck._name;
                        for (const card of deck._cards) {
                            const newCard = this._cardsCache.find(c => c.cardId === card._cardId);
                            newDeck.addCard(newCard);
                        }
                        this._decks.decks.push(newDeck);
                    }
                }
            }
        } else {
            /* in case of new patch delete all old info */
            localStorage.setItem('HearthstoneDeckBuilderPatch', JSON.stringify(this._patch));
            localStorage.removeItem('HearthstoneDeckBuilderCallsDone');
            localStorage.removeItem('HearthstoneDeckBuilderDecks');
            localStorage.removeItem('HearthstoneDeckBuilderCardsNoImageCache');
            localStorage.removeItem('HearthstoneDeckBuilderCardsCache');
        }
    }

    /**
     * Rebuild the cards shown array accordingly to the filters we have and the new filter applied
     */
    async _rebuildCardsShownArray(filterKey, filterValue) {
        /* change the filter */
        this._filtersObject.filtersApplied[filterKey] = filterValue;

        /* change first filter  */
        /* if no first filter means that first option in the chain was unset */
        if (!this._filtersObject.firstFilter) {
            let filterWithCallDoneFound = false;
            /* in that case search for a new filter applied with a call to the API done */
            Object.entries(this._filtersObject.filtersApplied).forEach(([k, v]) => {
                /* if filter is different from the filter we are modifying or removing and has value (is applied) */
                if (k !== filterKey && v !== false) {
                    /* if no filter with call to the API found */
                    if (!filterWithCallDoneFound) {
                        /* set that filter as a first filter */
                        this._filtersObject.firstFilter = k;
                        /* if the filter has a call to the API done. Don't allow bucle to modifiy first filter anymore.
                         * That means that the new chain of filters will start with a filter with a call to the API done
                         * and it will be unnecessary do more calls to the API.
                         * If filter with a call done is not found the call will be unavoidable*/
                        if (this._callsDone[k].find(call => call === v)) filterWithCallDoneFound = true;
                    }
                }
            });
        }

        /* reset the cardsshown array */
        this._cardsShown = [];

        /* if we have first filter proceed. In the case that first filter was undefined means that all filters are removed
         * and no cards has to be shown */
        if (this._filtersObject.firstFilter) {
            /* get an array with all filters that have to be applied */
            const newFiltersArray = Object.entries(this._filtersObject.filtersApplied).filter(
                filter => filter[1] !== false
            );

            /* search in that array if some filter has his call to the API done. */
            const filterWithCallDoneFound = newFiltersArray.find(
                ([k]) => k === this._filtersObject.firstFilter
            );

            /* if some filter with call done is found put it in the begining of the array so
             * the new filters chain starts with it. */
            if (filterWithCallDoneFound) {
                newFiltersArray.splice(newFiltersArray.indexOf(filterWithCallDoneFound), 1);
                newFiltersArray.unshift(filterWithCallDoneFound);
            }

            if (newFiltersArray && this.someFilterApplied) {
                let cardsAlreadyGotFromCache = false;
                /* for each filter applied */
                for (const filter of newFiltersArray) {
                    const k = filter[0];
                    const v = filter[1];

                    if (v !== false) {
                        /* if no cards shown and cards not get from cache for first time */
                        if (this._cardsShown.length === 0 && !cardsAlreadyGotFromCache) {
                            /* if call to the API not done make the call. This is necessary if we are removing the first filter and
                             * the second one don't have the call done */
                            if (!this._callsDone[k].find(e => e === v)) {
                                let cardsRetrieved;
                                /* make the call to the API */
                                switch (k) {
                                    case 'playerClass':
                                        cardsRetrieved = await requestCardsByPlayerClass(v);
                                        this._callsDone.playerClass.push(v);
                                        break;
                                    case 'cardSet':
                                        cardsRetrieved = await requestCardsByCardSet(v);
                                        this._callsDone.cardSet.push(v);
                                        break;
                                    case 'type':
                                        cardsRetrieved = await requestCardsByType(v);
                                        this._callsDone.type.push(v);
                                        break;
                                    case 'faction':
                                        cardsRetrieved = await requestCardsByFaction(v);
                                        this._callsDone.faction.push(v);
                                        break;
                                    case 'rarity':
                                        cardsRetrieved = await requestCardsByRarity(v);
                                        this._callsDone.rarity.push(v);
                                        break;
                                    case 'race':
                                        cardsRetrieved = await requestCardsByRace(v);
                                        this._callsDone.race.push(v);
                                        break;
                                }
                                /* update the cache */
                                if (cardsRetrieved) {
                                    cardsRetrieved.forEach(e => {
                                        const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);
                                        if (!cachedCard) {
                                            this._cardsCache.push(
                                                new Card(
                                                    e.cardId,
                                                    e.cardSet,
                                                    e.type,
                                                    e.faction,
                                                    e.rarity,
                                                    e.race,
                                                    e.playerClass
                                                )
                                            );
                                        }
                                    });
                                }
                                /* after call to API save info from cache and calls done */
                                localStorage.setItem(
                                    'HearthstoneDeckBuilderCallsDone',
                                    JSON.stringify(this._callsDone)
                                );
                                localStorage.setItem(
                                    'HearthstoneDeckBuilderCardsNoImageCache',
                                    JSON.stringify(this._cardsNoImageCache)
                                );
                                localStorage.setItem(
                                    'HearthstoneDeckBuilderCardsCache',
                                    JSON.stringify(this._cardsCache)
                                );
                            }

                            /* get the cards shown from cache */
                            this._cardsShown = this._cardsCache.filter(c => c[k] === v);
                            /* To prevent the case that some combination of filters result in an empty cardsShown array
                             * and the program get cards from cardsCache again.
                             */
                            cardsAlreadyGotFromCache = true;
                        } else {
                            /* all secondary filters will come here to apply more filters to cards shown */
                            this._cardsShown = this._cardsShown.filter(c => c[k] === v);
                        }
                    }
                }
            }
        }

        //TO_DO
        //this._cardsShown.sort();
    }

    /**
     * Apply filter by player class to cards shown property of deck builder
     */
    async _applyPlayerClassFilter(playerClass) {
        /* retrieve cards from endpoint and populate cache if not done earlier and if not first filter applied */
        if (!this._callsDone.playerClass.find(e => e === playerClass) &&
            !this._filtersObject.firstFilter
        ) {
            const cardsByPlayerClass = await requestCardsByPlayerClass(playerClass);
            if (cardsByPlayerClass) {
                cardsByPlayerClass.forEach(e => {
                    const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);
                    if (!cachedCard) {
                        this._cardsCache.push(
                            new Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass)
                        );
                    }
                });
            }
            this._callsDone.playerClass.push(playerClass);
        }

        if (!this._filtersObject.firstFilter) this._filtersObject.firstFilter = 'playerClass';

        /* rebuild the cards shown array */
        await this._rebuildCardsShownArray('playerClass', playerClass);
    }

    /**
     * Apply filter by card set to cards shown property of deck builder
     */
    async _applyCardSetFilter(cardSet) {
        if (!this._callsDone.cardSet.find(e => e === cardSet) && !this._filtersObject.firstFilter) {
            const cardsByCardSet = await requestCardsByCardSet(cardSet);
            if (cardsByCardSet) {
                cardsByCardSet.forEach(e => {
                    const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);
                    if (!cachedCard) {
                        this._cardsCache.push(
                            new Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass)
                        );
                    }
                });
            }

            this._callsDone.cardSet.push(cardSet);
        }

        if (!this._filtersObject.firstFilter) this._filtersObject.firstFilter = 'cardSet';

        /* rebuild the cards shown array */
        await this._rebuildCardsShownArray('cardSet', cardSet);
    }

    /**
     * Apply filter by type to cards shown property of deck builder
     */
    async _applyTypeFilter(type) {
        if (!this._callsDone.type.find(e => e === type) && !this._filtersObject.firstFilter) {
            const cardsByType = await requestCardsByType(type);
            if (cardsByType) {
                cardsByType.forEach(e => {
                    const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);
                    if (!cachedCard) {
                        this._cardsCache.push(
                            new Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass)
                        );
                    }
                });
            }

            this._callsDone.type.push(type);
        }

        if (!this._filtersObject.firstFilter) this._filtersObject.firstFilter = 'type';

        await this._rebuildCardsShownArray('type', type);
    }

    /**
     * Apply filter by faction to cards shown property of deck builder
     */
    async _applyFactionFilter(faction) {
        if (!this._callsDone.faction.find(e => e === faction) && !this._filtersObject.firstFilter) {
            const cardsByFaction = await requestCardsByFaction(faction);

            if (cardsByFaction) {
                cardsByFaction.forEach(e => {
                    const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);
                    if (!cachedCard) {
                        this._cardsCache.push(
                            new Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass)
                        );
                    } else {
                        this._cardsCache.find(c => c.cardId === cachedCard.cardId).faction = e.faction;
                    }
                });
            }

            this._callsDone.faction.push(faction);
        }

        if (!this._filtersObject.firstFilter) this._filtersObject.firstFilter = 'faction';

        await this._rebuildCardsShownArray('faction', faction);
    }

    /**
     * Apply filter by rarity to cards shown property of deck builder
     */
    async _applyRarityFilter(rarity) {
        if (!this._callsDone.rarity.find(e => e === rarity) && !this._filtersObject.firstFilter) {
            const cardsByRarity = await requestCardsByRarity(rarity);
            if (cardsByRarity) {
                cardsByRarity.forEach(e => {
                    const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);
                    if (!cachedCard) {
                        this._cardsCache.push(
                            new Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass)
                        );
                    } else {
                        this._cardsCache.find(c => c.cardId === cachedCard.cardId).rarity = e.rarity;
                    }
                });
            }

            this._callsDone.rarity.push(rarity);
        }

        if (!this._filtersObject.firstFilter) this._filtersObject.firstFilter = 'rarity';

        await this._rebuildCardsShownArray('rarity', rarity);
    }

    /**
     * Apply filter by race to cards shown property of deck builder
     */
    async _applyRaceFilter(race) {
        if (!this._callsDone.race.find(e => e === race) && !this._filtersObject.firstFilter) {
            const cardsByRace = await requestCardsByRace(race);
            if (cardsByRace) {
                cardsByRace.forEach(e => {
                    const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);
                    if (!cachedCard) {
                        this._cardsCache.push(
                            new Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass)
                        );
                    } else {
                        this._cardsCache.find(c => c.cardId === cachedCard.cardId).race = e.race;
                    }
                });
            }

            this._callsDone.race.push(race);
        }

        if (!this._filtersObject.firstFilter) this._filtersObject.firstFilter = 'race';
        await this._rebuildCardsShownArray('race', race);
    }

    /* get just one card from API */
    async getCardByCardId(cardId) {
        const cachedCard = this._cardsCache.find(card => card.cardId === cardId);
        if (cachedCard && cachedCard.infoCompleted) {
            return cachedCard;
        } else {
            const rawCard = await requestCardByCardId(cardId);
            if (rawCard) {
                const cachedCard = this._cardsCache.find(card => card.cardId === rawCard.cardId);
                /* if no cached card create new object */
                if (!cachedCard) {
                    const card = new Card(
                        rawCard.cardId,
                        rawCard.cardSet,
                        rawCard.type,
                        rawCard.faction,
                        rawCard.rarity,
                        rawCard.race,
                        rawCard.playerClass
                    );

                    card.name = rawCard.name;
                    card.cost = rawCard.cost;
                    card.attack = rawCard.attack;
                    card.health = rawCard.health;
                    card.text = rawCard.text;
                    card.flavor = rawCard.flavor;
                    card.artist = rawCard.artist;
                    card.collectible = rawCard.collectibl;
                    card.elite = rawCard.elite;
                    card.locale = rawCard.locale;
                    card.infoCompleted = true;

                    this._cardsCache.push(card);
                    localStorage.setItem(
                        'HearthstoneDeckBuilderCardsCache',
                        JSON.stringify(this._cardsCache)
                    );
                    return card;
                    /* if cached update element */
                } else {
                    cachedCard.faction = rawCard.faction;
                    cachedCard.rarity = rawCard.rarity;
                    cachedCard.race = rawCard.race;
                    cachedCard.name = rawCard.name;
                    cachedCard.cost = rawCard.cost;
                    cachedCard.attack = rawCard.attack;
                    cachedCard.health = rawCard.health;
                    cachedCard.text = rawCard.text;
                    cachedCard.flavor = rawCard.flavor;
                    cachedCard.artist = rawCard.artist;
                    cachedCard.collectible = rawCard.collectibl;
                    cachedCard.elite = rawCard.elite;
                    cachedCard.locale = rawCard.locale;
                    cachedCard.infoCompleted = true;
                    localStorage.setItem(
                        'HearthstoneDeckBuilderCardsCache',
                        JSON.stringify(this._cardsCache)
                    );
                    return cachedCard;
                }
            }
        }
    }

    /**
     * Generic function to Apply filter  to cards shown property of deck builder
     */
    async applyFilter(key, filter) {
        switch (key) {
            case 'playerClass':
                await this._applyPlayerClassFilter(filter);
                break;
            case 'cardSet':
                await this._applyCardSetFilter(filter);
                break;
            case 'type':
                await this._applyTypeFilter(filter);
                break;
            case 'faction':
                await this._applyFactionFilter(filter);
                break;
            case 'rarity':
                await this._applyRarityFilter(filter);
                break;
            case 'race':
                await this._applyRaceFilter(filter);
                break;
            default:
                return -1;
        }

        /* after apply filter save info from cache and calls done */
        localStorage.setItem('HearthstoneDeckBuilderCallsDone', JSON.stringify(this._callsDone));
        localStorage.setItem(
            'HearthstoneDeckBuilderCardsNoImageCache',
            JSON.stringify(this._cardsNoImageCache)
        );
        localStorage.setItem('HearthstoneDeckBuilderCardsCache', JSON.stringify(this._cardsCache));

        return this._cardsShown;
    }

    /**
     * Generic function to remove filter to cards shown property of deck builder
     */
    async removeFilter(filterKey) {
        /* If filter applied */
        if (this._filtersObject.filtersApplied[filterKey]) {
            /* rebuild cards shown array */
            if (this._filtersObject.firstFilter === filterKey) {
                this._filtersObject.firstFilter = undefined;
            }
            await this._rebuildCardsShownArray(filterKey, false);
        }
    }

    /* cards with no image are moved to the cards no image cache. Now it is unused but who knows.
     * That function is launched when an image fires onerror event */
    cardWithNoImg(cardWithNoImg) {
        this._cardsShown = this._cardsShown.filter(card => card.cardId !== cardWithNoImg.cardId);
        this._cardsCache = this._cardsCache.filter(card => card.cardId !== cardWithNoImg.cardId);
        cardWithNoImg.img = 'no-img-available';
        this._cardsNoImageCache.push(cardWithNoImg);
        localStorage.setItem(
            'HearthstoneDeckBuilderCardsNoImageCache',
            JSON.stringify(this._cardsNoImageCache)
        );
        localStorage.setItem('HearthstoneDeckBuilderCardsCache', JSON.stringify(this._cardsCache));
    }

    someFilterApplied() {
        if (this._filtersObject.firstFilter) {
            return true;
        } else {
            return false;
        }
    }

    /* to draw filters */
    getSelectors() {
        return {
            playerClass: {
                text: 'player classes',
                arr: this._playerClasses
            },
            cardSet: {
                text: 'card sets',
                arr: this._cardSets
            },
            type: {
                text: 'types',
                arr: this._types
            },
            faction: {
                text: 'factions',
                arr: this._factions
            },
            rarity: {
                text: 'rarities',
                arr: this._rarities
            },
            race: {
                text: 'races',
                arr: this._races
            }
        };
    }

    get playerClasses() {
        return this._playerClasses;
    }

    get cardSets() {
        return this._cardSets;
    }

    get types() {
        return this._types;
    }

    get factions() {
        return this._factions;
    }

    get rarities() {
        return this._rarities;
    }

    get races() {
        return this._races;
    }

    get patch() {
        return this._patch;
    }

    get cardsShown() {
        return this._cardsShown;
    }

    get decks() {
        return this._decks.decks;
    }

    getDeck(id) {
        return this._decks.decks.find(deck => deck.id === id);
    }

    addDeck(deck) {
        this._decks.decks.push(deck);
    }

    removeDeck(deckId) {
        this._decks.decks = this._decks.decks.filter(d => d.id !== deckId);
    }

    get activeDeck() {
        return this._decks.activeDeck;
    }

    set activeDeck(id) {
        this._decks.activeDeck = id;
    }

    get nCachedCards() {
        return this._cardsCache.length + this._cardsNoImageCache.length;
    }
}