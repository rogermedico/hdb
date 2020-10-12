import { initDB } from './utils/initDB';

import { drawFilters, bindFilterEvents, drawCards, drawDecks } from './utils/views';

(async() => {
    const db = await initDB();
    await drawFilters(db);
    await drawDecks(db);
    await bindFilterEvents(db);
    drawCards(db);

    console.log(db);
})();