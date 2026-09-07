/* ================================================================
   RAPI API Client — auto-detects backend URL
   Works locally AND on any deployed host (Render, Railway, etc.)
   ================================================================ */

// When Flask serves everything, the API is on the same host.
// No more localhost:5001 hardcoding.
const API = '/api';

async function apiFetch(path) {
  try {
    const r = await fetch(API + path);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } catch (e) {
    console.warn('[RAPI] fetch failed:', e.message);
    return null;
  }
}

async function fetchNAI()                          { return await apiFetch('/nai'); }
async function fetchNAISeries()                    { return await apiFetch('/nai/series'); }
async function fetchRoutes(limit = 52)             { return await apiFetch(`/routes?limit=${limit}`); }
async function fetchAirlines()                     { return await apiFetch('/airlines'); }
async function fetchElasticity(routeId)            { return await apiFetch(`/elasticity/${routeId}`); }
async function fetchFareComponents(routeId)        { return await apiFetch(`/farecomponents/${routeId}`); }
async function fetchSearch(from, to, lead, cabin)  {
  return await apiFetch(`/search?from=${from}&to=${to}&lead=${lead}&cabin=${encodeURIComponent(cabin)}`);
}
