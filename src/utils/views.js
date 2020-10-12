import tyrande from '../../assets/tyrande.png';
import error from '../../assets/error-bg.png';
import { Deck } from '../Classes/Deck';

/* Draw filters based into info provided from deck board object */
export async function drawFilters(db) {
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
export async function bindFilterEvents(db) {
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
export function drawCards(db) {
    const cardsContainer = document.querySelector('#cardsContainer');
    cardsContainer.textContent = '';
    /* if no cards to show and no filters applied draw starting page */
    if (db.cardsShown.length === 0 && !db.someFilterApplied()) {
        const noCardDiv = document.createElement('div');
        noCardDiv.classList.add('no-cards-shown', 'mt-15vh');
        const noCardImg = document.createElement('img');
        noCardImg.src = tyrande;
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
        noCardImg.src = error;
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
                document
                    .querySelector('#cardsContainer')
                    .removeChild(document.querySelector('#' + c.cardId).parentElement);
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
                } else {
                    //alert('Select or create a deck before adding cards to it');
                }
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
export async function drawDecks(db) {
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
        const deck = new Deck();
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
export function drawCardInfo(card) {
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