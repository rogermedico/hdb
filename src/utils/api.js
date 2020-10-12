import { ENDPOINTS } from './endpoints';

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
        const response = await fetch(url + ENDPOINTS.MODIFIERS, { method: 'GET', headers });
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

export async function requestInfo() {
    return await getEndpoint(ENDPOINTS.INFO);
}

export async function requestCardByCardId(cardId) {
    const card = await getEndpoint(ENDPOINTS.CARD_BY_ID + cardId);
    return card.pop();
}

export async function requestCardsByPlayerClass(playerClass) {
    return await getEndpoint(ENDPOINTS.CARDS_BY_CLASS + playerClass);
}

export async function requestCardsByCardSet(cardSet) {
    return await getEndpoint(ENDPOINTS.CARDS_BY_SET + cardSet);
}

export async function requestCardsByType(type) {
    return await getEndpoint(ENDPOINTS.CARDS_BY_TYPE + type);
}

export async function requestCardsByFaction(faction) {
    return await getEndpoint(ENDPOINTS.CARDS_BY_FACTION + faction);
}

export async function requestCardsByRarity(rarity) {
    return await getEndpoint(ENDPOINTS.CARDS_BY_QUALITY + rarity);
}

export async function requestCardsByRace(race) {
    return await getEndpoint(ENDPOINTS.CARDS_BY_RACE + race);
}