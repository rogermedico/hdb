// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"utils/endpoints.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ENDPOINTS = void 0;
const ENDPOINTS = {
  /* RapidAPI Hearthstone endpoints */
  INFO: 'https://omgvamp-hearthstone-v1.p.rapidapi.com/info',
  CARD_BY_ID: 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/',
  CARDS_BY_CLASS: 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/classes/',
  CARDS_BY_SET: 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/sets/',
  CARDS_BY_TYPE: 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/types/',
  CARDS_BY_FACTION: 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/factions/',
  CARDS_BY_QUALITY: 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/qualities/',
  CARDS_BY_RACE: 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/races/',

  /* RapidAPI Hearthstone call options */
  // MODIFIERS: '?collectible=1',
  MODIFIERS: '',

  /* hearthstonejson images endpoints */
  IMG: 'https://art.hearthstonejson.com/v1/render/latest/enUS/256x/'
};
exports.ENDPOINTS = ENDPOINTS;
},{}],"utils/api.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestInfo = requestInfo;
exports.requestCardByCardId = requestCardByCardId;
exports.requestCardsByPlayerClass = requestCardsByPlayerClass;
exports.requestCardsByCardSet = requestCardsByCardSet;
exports.requestCardsByType = requestCardsByType;
exports.requestCardsByFaction = requestCardsByFaction;
exports.requestCardsByRarity = requestCardsByRarity;
exports.requestCardsByRace = requestCardsByRace;

var _endpoints = require("./endpoints");

const RAPID_API_HOST = 'omgvamp-hearthstone-v1.p.rapidapi.com';
const RAPID_API_KEY = 'f6fe973a55mshb2cdb6e42332b71p1b12ccjsndf391a414a74';
/*
 * To make calls to RapidAPI endpoints
 */

async function getEndpoint(url) {
  const headers = new Headers();
  headers.append('x-rapidapi-host', RAPID_API_HOST);
  headers.append('x-rapidapi-key', RAPID_API_KEY);

  try {
    const response = await fetch(url + _endpoints.ENDPOINTS.MODIFIERS, {
      method: 'GET',
      headers
    });

    if (response.ok) {
      const apiData = await response.json();
      return apiData;
    } else {
      return response.ok;
    }
  } catch (err) {
    console.log('fetch failed', err);
  }
}

async function requestInfo() {
  return await getEndpoint(_endpoints.ENDPOINTS.INFO);
}

async function requestCardByCardId(cardId) {
  const card = await getEndpoint(_endpoints.ENDPOINTS.CARD_BY_ID + cardId);
  return card.pop();
}

async function requestCardsByPlayerClass(playerClass) {
  return await getEndpoint(_endpoints.ENDPOINTS.CARDS_BY_CLASS + playerClass);
}

async function requestCardsByCardSet(cardSet) {
  return await getEndpoint(_endpoints.ENDPOINTS.CARDS_BY_SET + cardSet);
}

async function requestCardsByType(type) {
  return await getEndpoint(_endpoints.ENDPOINTS.CARDS_BY_TYPE + type);
}

async function requestCardsByFaction(faction) {
  return await getEndpoint(_endpoints.ENDPOINTS.CARDS_BY_FACTION + faction);
}

async function requestCardsByRarity(rarity) {
  return await getEndpoint(_endpoints.ENDPOINTS.CARDS_BY_QUALITY + rarity);
}

async function requestCardsByRace(race) {
  return await getEndpoint(_endpoints.ENDPOINTS.CARDS_BY_RACE + race);
}
},{"./endpoints":"utils/endpoints.js"}],"Classes/Card.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Card = void 0;

var _endpoints = require("../utils/endpoints");

class Card {
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
    return _endpoints.ENDPOINTS.IMG + cardId + '.png';
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
  } // set cardId(cardId) {
  //     this._cardId = cardId;
  // }


  get playerClass() {
    return this._playerClass;
  } // set playerClass(playerClass) {
  //     this._playerClass = playerClass;
  // }


  get cardSet() {
    return this._cardSet;
  } // set cardSet(cardSet) {
  //     this._cardSet = cardSet;
  // }


  get type() {
    return this._type;
  } // set type(type) {
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

exports.Card = Card;
},{"../utils/endpoints":"utils/endpoints.js"}],"Classes/Deck.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Deck = void 0;

class Deck {
  constructor() {
    this._id = this._uuidv4();
    this._name = 'New deck';
    this._cards = [];
  }

  _uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
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

exports.Deck = Deck;
},{}],"Classes/DeckBuilder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeckBuilder = void 0;

var _api = require("../utils/api");

var _Card = require("../Classes/Card");

var _Deck = require("./Deck");

class DeckBuilder {
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
      const browserCardsNoImageCache = JSON.parse(localStorage.getItem('HearthstoneDeckBuilderCardsNoImageCache'));
      const browserCardsCache = JSON.parse(localStorage.getItem('HearthstoneDeckBuilderCardsCache'));
      /* info about calls done and cached cards */

      if (browserCallsDone && browserCardsCache && browserCardsNoImageCache) {
        /* retrieve calls done */
        this._callsDone = browserCallsDone;
        /* retrieve cards cache, we have to create new objects because getters and setters are not saved */

        browserCardsCache.forEach(card => {
          const newCard = new _Card.Card(card._cardId, card._cardSet, card._type, card._faction, card._rarity, card._race, card._playerClass);
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
          const newCard = new _Card.Card(card._cardId, card._cardSet, card._type, card._faction, card._rarity, card._race, card._playerClass);
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
            const newDeck = new _Deck.Deck();
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
      const newFiltersArray = Object.entries(this._filtersObject.filtersApplied).filter(filter => filter[1] !== false);
      /* search in that array if some filter has his call to the API done. */

      const filterWithCallDoneFound = newFiltersArray.find(([k]) => k === this._filtersObject.firstFilter);
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
                    cardsRetrieved = await (0, _api.requestCardsByPlayerClass)(v);

                    this._callsDone.playerClass.push(v);

                    break;

                  case 'cardSet':
                    cardsRetrieved = await (0, _api.requestCardsByCardSet)(v);

                    this._callsDone.cardSet.push(v);

                    break;

                  case 'type':
                    cardsRetrieved = await (0, _api.requestCardsByType)(v);

                    this._callsDone.type.push(v);

                    break;

                  case 'faction':
                    cardsRetrieved = await (0, _api.requestCardsByFaction)(v);

                    this._callsDone.faction.push(v);

                    break;

                  case 'rarity':
                    cardsRetrieved = await (0, _api.requestCardsByRarity)(v);

                    this._callsDone.rarity.push(v);

                    break;

                  case 'race':
                    cardsRetrieved = await (0, _api.requestCardsByRace)(v);

                    this._callsDone.race.push(v);

                    break;
                }
                /* update the cache */


                if (cardsRetrieved) {
                  cardsRetrieved.forEach(e => {
                    const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);

                    if (!cachedCard) {
                      this._cardsCache.push(new _Card.Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass));
                    }
                  });
                }
                /* after call to API save info from cache and calls done */


                localStorage.setItem('HearthstoneDeckBuilderCallsDone', JSON.stringify(this._callsDone));
                localStorage.setItem('HearthstoneDeckBuilderCardsNoImageCache', JSON.stringify(this._cardsNoImageCache));
                localStorage.setItem('HearthstoneDeckBuilderCardsCache', JSON.stringify(this._cardsCache));
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
    } //TO_DO
    //this._cardsShown.sort();

  }
  /**
   * Apply filter by player class to cards shown property of deck builder
   */


  async _applyPlayerClassFilter(playerClass) {
    /* retrieve cards from endpoint and populate cache if not done earlier and if not first filter applied */
    if (!this._callsDone.playerClass.find(e => e === playerClass) && !this._filtersObject.firstFilter) {
      const cardsByPlayerClass = await (0, _api.requestCardsByPlayerClass)(playerClass);

      if (cardsByPlayerClass) {
        cardsByPlayerClass.forEach(e => {
          const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);

          if (!cachedCard) {
            this._cardsCache.push(new _Card.Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass));
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
      const cardsByCardSet = await (0, _api.requestCardsByCardSet)(cardSet);

      if (cardsByCardSet) {
        cardsByCardSet.forEach(e => {
          const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);

          if (!cachedCard) {
            this._cardsCache.push(new _Card.Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass));
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
      const cardsByType = await (0, _api.requestCardsByType)(type);

      if (cardsByType) {
        cardsByType.forEach(e => {
          const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);

          if (!cachedCard) {
            this._cardsCache.push(new _Card.Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass));
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
      const cardsByFaction = await (0, _api.requestCardsByFaction)(faction);

      if (cardsByFaction) {
        cardsByFaction.forEach(e => {
          const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);

          if (!cachedCard) {
            this._cardsCache.push(new _Card.Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass));
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
      const cardsByRarity = await (0, _api.requestCardsByRarity)(rarity);

      if (cardsByRarity) {
        cardsByRarity.forEach(e => {
          const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);

          if (!cachedCard) {
            this._cardsCache.push(new _Card.Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass));
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
      const cardsByRace = await (0, _api.requestCardsByRace)(race);

      if (cardsByRace) {
        cardsByRace.forEach(e => {
          const cachedCard = this._cardsCache.find(card => card.cardId === e.cardId);

          if (!cachedCard) {
            this._cardsCache.push(new _Card.Card(e.cardId, e.cardSet, e.type, e.faction, e.rarity, e.race, e.playerClass));
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
      const rawCard = await (0, _api.requestCardByCardId)(cardId);

      if (rawCard) {
        const cachedCard = this._cardsCache.find(card => card.cardId === rawCard.cardId);
        /* if no cached card create new object */


        if (!cachedCard) {
          const card = new _Card.Card(rawCard.cardId, rawCard.cardSet, rawCard.type, rawCard.faction, rawCard.rarity, rawCard.race, rawCard.playerClass);
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

          localStorage.setItem('HearthstoneDeckBuilderCardsCache', JSON.stringify(this._cardsCache));
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
          localStorage.setItem('HearthstoneDeckBuilderCardsCache', JSON.stringify(this._cardsCache));
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
    localStorage.setItem('HearthstoneDeckBuilderCardsNoImageCache', JSON.stringify(this._cardsNoImageCache));
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

    localStorage.setItem('HearthstoneDeckBuilderCardsNoImageCache', JSON.stringify(this._cardsNoImageCache));
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

exports.DeckBuilder = DeckBuilder;
},{"../utils/api":"utils/api.js","../Classes/Card":"Classes/Card.js","./Deck":"Classes/Deck.js"}],"utils/initDB.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initDB = initDB;

var _api = require("./api");

var _DeckBuilder = require("../Classes/DeckBuilder");

/**
 * Create and initialize Deck Board Object with info retrieved from the endpoint
 */
async function initDB() {
  const info = await (0, _api.requestInfo)();
  const db = new _DeckBuilder.DeckBuilder(info.classes, info.sets, info.types, info.factions, info.qualities, info.races, info.patch);
  return db;
}
},{"./api":"utils/api.js","../Classes/DeckBuilder":"Classes/DeckBuilder.js"}],"../assets/tyrande.png":[function(require,module,exports) {
module.exports = "/tyrande.37ec3655.png";
},{}],"../assets/error-bg.png":[function(require,module,exports) {
module.exports = "/error-bg.380c5db5.png";
},{}],"utils/views.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawFilters = drawFilters;
exports.bindFilterEvents = bindFilterEvents;
exports.drawCards = drawCards;
exports.drawDecks = drawDecks;
exports.drawCardInfo = drawCardInfo;

var _tyrande = _interopRequireDefault(require("../../assets/tyrande.png"));

var _errorBg = _interopRequireDefault(require("../../assets/error-bg.png"));

var _Deck = require("../Classes/Deck");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Draw filters based into info provided from deck board object */
async function drawFilters(db) {
  const selectors = db.getSelectors();
  Object.entries(selectors).forEach(([k, v]) => {
    const select = document.createElement('select');
    select.classList.add('filter-select');
    select.id = v.text.replace(/ +/g, '-') + '-select';
    select.setAttribute('data-identifier', k);
    const optionElement = document.createElement('option');
    optionElement.setAttribute('value', '');
    optionElement.textContent = 'All ' + v.text;
    select.appendChild(optionElement);
    v.arr.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.setAttribute('value', option);
      optionElement.innerHTML = option;
      select.appendChild(optionElement);
    });
    document.querySelector('#select-container').appendChild(select);
  });
  /* draw the current patch */

  document.querySelector('#patch').innerHTML = 'Patch: ' + db.patch;
}
/* bind events to the filters elements */


async function bindFilterEvents(db) {
  /* foreach select bind his own event */
  document.querySelector('#select-container').childNodes.forEach(select => {
    const selectId = select.dataset.identifier;
    select.addEventListener('change', async event => {
      const cardsContainer = document.querySelector('#cardsContainer');
      /* draw the loading effect */

      cardsContainer.innerHTML = '<div class="loader">Loading...</div>';

      if (!event.target.value) {
        /* if no value remove filer */
        await db.removeFilter(selectId);
      } else {
        /* if value apply or modify filter */
        await db.applyFilter(selectId, event.target.value);
      }
      /* after apply or remove filter draw cards */


      drawCards(db);
    });
  });
}
/* draws the cards that has to be shown */


function drawCards(db) {
  const cardsContainer = document.querySelector('#cardsContainer');
  cardsContainer.textContent = '';
  /* if no cards to show and no filters applied draw starting page */

  if (db.cardsShown.length === 0 && !db.someFilterApplied()) {
    const noCardDiv = document.createElement('div');
    noCardDiv.classList.add('no-cards-shown', 'mt-15vh');
    const noCardImg = document.createElement('img');
    noCardImg.src = _tyrande.default;
    noCardImg.classList.add('no-cards-shown-img');
    const noCardText = document.createElement('h1');
    noCardText.innerHTML = 'Select some filter to start';
    noCardText.classList.add('no-cards-shown-text');
    noCardDiv.appendChild(noCardImg);
    noCardDiv.appendChild(noCardText);
    cardsContainer.appendChild(noCardDiv);
  }
  /* if no cards to show and filters applied draw zero cards found page */


  if (db.cardsShown.length === 0 && db.someFilterApplied()) {
    const noCardDiv = document.createElement('div');
    noCardDiv.classList.add('no-cards-shown', 'mt-10vh');
    const noCardImg = document.createElement('img');
    noCardImg.src = _errorBg.default;
    noCardImg.classList.add('error-img');
    const noCardText = document.createElement('h1');
    noCardText.innerHTML = 'Ooops! Nothing to show . . .';
    noCardText.classList.add('no-cards-shown-text');
    noCardDiv.appendChild(noCardImg);
    noCardDiv.appendChild(noCardText);
    cardsContainer.appendChild(noCardDiv);
  } else {
    /* for each card found draw it */
    db.cardsShown.forEach(async c => {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('individual-card-container');
      const cardImg = document.createElement('img');
      cardImg.classList.add('card-img');
      cardImg.src = c.img;
      cardImg.id = c.cardId;
      /* add event that fires if image returns 404. That event removes node from DOM and triggers db.cardWithNoImg() */

      cardImg.addEventListener('error', () => {
        document.querySelector('#cardsContainer').removeChild(document.querySelector('#' + c.cardId).parentElement);
        db.cardWithNoImg(c);
      });
      /* add event on click at every image. */

      cardImg.addEventListener('click', async event => {
        /* if click specific image retrieve ALL info from API */
        await db.getCardByCardId(event.target.id);
        /* if there are some active deck add card to that deck */

        if (db.activeDeck) {
          /* add card to deck and build DOM node */
          const deck = db.getDeck(db.activeDeck);
          deck.addCard(c);
          /* when card is added save the current decks status to browser */

          localStorage.setItem('HearthstoneDeckBuilderDecks', JSON.stringify(db.decks));
          const cardsList = document.querySelector('#cards-in-deck-list');
          const listElement = document.createElement('li');
          listElement.id = 'deck-listed-card-' + c.cardId;
          listElement.classList.add('deck-list-element');
          const name = document.createElement('span');
          name.classList.add('card-deck-name');
          name.textContent = c.name;
          /* add event listener to that node to show card info */

          name.addEventListener('click', () => {
            drawCardInfo(c);
          });
          /* build a delete icon  */

          const delContainer = document.createElement('span');
          delContainer.classList.add('delete-icon');
          const del = document.createElement('i');
          del.classList.add('material-icons');
          del.setAttribute('title', 'Delete');
          del.append(document.createTextNode('delete'));
          /* on click that icon delete node from DOM and remove card from active deck */

          del.addEventListener('click', () => {
            document.getElementById('deck-listed-card-' + c.cardId).remove();
            deck.removeCard(c.cardId);
            /* when card is removed save the current decks status to browser */

            localStorage.setItem('HearthstoneDeckBuilderDecks', JSON.stringify(db.decks));
          });
          delContainer.appendChild(del);
          listElement.appendChild(name);
          listElement.appendChild(delContainer);
          cardsList.appendChild(listElement);
        } else {} //alert('Select or create a deck before adding cards to it');

        /* draw card info */


        drawCardInfo(c);
      });
      cardImg.classList.add('card-img');
      cardDiv.appendChild(cardImg);
      cardsContainer.appendChild(cardDiv);
    });
  }
  /* update the number of cards cached */


  document.querySelector('#cached-cards').textContent = 'Cached Cards: ' + db.nCachedCards;
}
/* draw decks */


async function drawDecks(db) {
  const decksContainer = document.querySelector('#decks-container');
  decksContainer.innerHTML = '';
  /* deck title */

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('deck-content-title');
  const title = document.createElement('span');
  title.textContent = 'My decks';
  titleDiv.appendChild(title);
  decksContainer.appendChild(titleDiv);
  /* button to add deck */

  const createDeckButton = document.createElement('button');
  createDeckButton.classList.add('deck-section-button', 'button');
  createDeckButton.id = 'create-deck-button';
  createDeckButton.innerHTML = 'New deck';
  /* on click create new deck */

  createDeckButton.addEventListener('click', () => {
    const deck = new _Deck.Deck();
    db.addDeck(deck);
    /* on create deck save new deck status */

    localStorage.setItem('HearthstoneDeckBuilderDecks', JSON.stringify(db.decks));
    const deckDiv = document.createElement('div');
    deckDiv.classList.add('deck-element');
    deckDiv.id = deck.id;
    const deckTitle = document.createElement('span');
    deckTitle.classList.add('deck-title-element');
    deckTitle.textContent = deck.name;
    /* on click set that deck to active deck */

    deckTitle.addEventListener('click', () => {
      db.activeDeck = deck.id;
      drawActiveDeck(db);
    });
    /* make a delete deck icon */

    const delContainer = document.createElement('span');
    delContainer.classList.add('delete-icon');
    const del = document.createElement('i');
    del.classList.add('material-icons');
    del.setAttribute('title', 'Delete');
    del.append(document.createTextNode('delete'));
    /* on click remove node from DOM and remove deck from deck builder */

    del.addEventListener('click', () => {
      document.getElementById(deck.id).remove();
      db.removeDeck(deck.id);
      /* save new decks status */

      localStorage.setItem('HearthstoneDeckBuilderDecks', JSON.stringify(db.decks));
    });
    delContainer.appendChild(del);
    deckDiv.appendChild(deckTitle);
    deckDiv.appendChild(delContainer);
    decksContainer.insertBefore(deckDiv, createDeckButton);
  });
  /* if there are others decks draw them to de DOM too */

  db.decks.forEach(deck => {
    const deckDiv = document.createElement('div');
    deckDiv.classList.add('deck-element');
    deckDiv.id = deck.id;
    const deckTitle = document.createElement('span');
    deckTitle.classList.add('deck-title-element');
    deckTitle.textContent = deck.name;
    deckTitle.addEventListener('click', () => {
      db.activeDeck = deck.id;
      drawActiveDeck(db);
    });
    const delContainer = document.createElement('span');
    delContainer.classList.add('delete-icon');
    const del = document.createElement('i');
    del.classList.add('material-icons');
    del.setAttribute('title', 'Delete');
    del.append(document.createTextNode('delete'));
    del.addEventListener('click', () => {
      document.getElementById(deck.id).remove();
      db.removeDeck(deck.id);
      localStorage.setItem('HearthstoneDeckBuilderDecks', JSON.stringify(db.decks));
    });
    delContainer.appendChild(del);
    deckDiv.appendChild(deckTitle);
    deckDiv.appendChild(delContainer);
    decksContainer.appendChild(deckDiv);
  });
  decksContainer.appendChild(createDeckButton);
}
/* draw active deck */


function drawActiveDeck(db) {
  const decksContainer = document.querySelector('#decks-container');
  decksContainer.innerHTML = '';
  /* get active deck */

  const deck = db.getDeck(db.activeDeck);
  /* draw title */

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('deck-content-title');
  const title = document.createElement('span');
  /* make it editable so users can change name of the deck */

  title.contentEditable = true;
  title.classList.add('editable', 'deck-title-span');
  title.textContent = deck.name;
  titleDiv.appendChild(title);
  /* on focus out save name */

  title.addEventListener('focusout', event => {
    if (event.target.textContent) {
      deck.name = event.target.textContent.substring(0, 15).replace(/[^a-z0-9 ]/gi, '');
    }

    title.textContent = deck.name;
    localStorage.setItem('HearthstoneDeckBuilderDecks', JSON.stringify(db.decks));
  });
  decksContainer.appendChild(titleDiv);
  const cardsInDeckContainer = document.createElement('div');
  const cardsInDeck = document.createElement('ul');
  cardsInDeck.id = 'cards-in-deck-list';
  cardsInDeck.classList.add('cards-in-deck-list');
  /* for each card already added to deck draw it  */

  deck.cards.forEach(card => {
    const listElement = document.createElement('li');
    listElement.id = 'deck-listed-card-' + card.cardId;
    listElement.classList.add('deck-list-element');
    const name = document.createElement('span');
    name.classList.add('card-deck-name');
    name.textContent = card.name;
    /* on click the card show info */

    name.addEventListener('click', () => {
      drawCardInfo(card);
    });
    /* every card has his own delete icon */

    const delContainer = document.createElement('span');
    delContainer.classList.add('delete-icon');
    const del = document.createElement('i');
    del.classList.add('material-icons');
    del.setAttribute('title', 'Delete');
    del.append(document.createTextNode('delete'));
    del.addEventListener('click', () => {
      document.getElementById('deck-listed-card-' + card.cardId).remove();
      deck.removeCard(card.cardId);
      localStorage.setItem('HearthstoneDeckBuilderDecks', JSON.stringify(db.decks));
    });
    delContainer.appendChild(del);
    listElement.appendChild(name);
    listElement.appendChild(delContainer);
    cardsInDeck.appendChild(listElement);
  });
  cardsInDeckContainer.appendChild(cardsInDeck);
  decksContainer.appendChild(cardsInDeckContainer);
  /* go back button to return to my decks */

  const deckFooter = document.createElement('div');
  const backLink = document.createElement('button');
  backLink.classList.add('deck-section-button', 'button');
  backLink.id = 'back-deck-button';
  backLink.innerHTML = 'Back';
  backLink.addEventListener('click', () => {
    db.activeDeck = undefined;
    drawDecks(db);
  });
  deckFooter.appendChild(backLink);
  decksContainer.appendChild(deckFooter);
}
/* draw card info */


function drawCardInfo(card) {
  const cardInfoContainer = document.querySelector('#card-info');
  cardInfoContainer.innerHTML = '';
  /* title */

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('card-info-title');
  const title = document.createElement('span');
  title.textContent = 'Card Info';
  titleDiv.appendChild(title);
  cardInfoContainer.appendChild(titleDiv);
  /* for each property set of that card draw it */

  Object.entries(card.getAllProperties()).forEach(([k, v]) => {
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('card-info-property');
    contentDiv.innerHTML = '<span class="strong">' + k + ':</span> ' + v;
    cardInfoContainer.appendChild(contentDiv);
  });
}
},{"../../assets/tyrande.png":"../assets/tyrande.png","../../assets/error-bg.png":"../assets/error-bg.png","../Classes/Deck":"Classes/Deck.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _initDB = require("./utils/initDB");

var _views = require("./utils/views");

(async () => {
  const db = await (0, _initDB.initDB)();
  await (0, _views.drawFilters)(db);
  await (0, _views.drawDecks)(db);
  await (0, _views.bindFilterEvents)(db);
  (0, _views.drawCards)(db);
  console.log(db);
})();
},{"./utils/initDB":"utils/initDB.js","./utils/views":"utils/views.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50088" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map