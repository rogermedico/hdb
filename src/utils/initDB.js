import { requestInfo } from './api';
import { DeckBuilder } from '../Classes/DeckBuilder';

/**
 * Create and initialize Deck Board Object with info retrieved from the endpoint
 */
export async function initDB() {
    const info = await requestInfo();
    const db = new DeckBuilder(
        info.classes,
        info.sets,
        info.types,
        info.factions,
        info.qualities,
        info.races,
        info.patch
    );

    return db;
}