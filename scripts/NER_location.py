from dataclasses import dataclass
from typing import Optional, Dict, Any, List, Tuple
import re

import spacy
import geonamescache
from rapidfuzz import process, fuzz

# ---------- Setup ----------
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise ImportError("Run 'python -m spacy download en_core_web_sm' first.")

gc = geonamescache.GeonamesCache()
COUNTRIES = gc.get_countries()
CITIES = gc.get_cities()

# Prebuild searchable name lists
country_name_to_iso2 = {}
country_names = []
for iso2, c in COUNTRIES.items():
    name = c["name"]
    country_names.append(name)
    country_name_to_iso2[name.lower()] = iso2
    for key in ["iso3", "iso"]:
        if key in c:
            country_name_to_iso2[c[key].lower()] = iso2

city_index = {}
for _, city in CITIES.items():
    nm = city["name"].lower()
    city_index.setdefault(nm, []).append(city)

city_names = list(city_index.keys())
JUNK_TOKENS = {"may", "march", "spring", "fall", "summer", "winter", "today"}

@dataclass
class LocationResult:
    city: Optional[str]
    region: Optional[str]
    country: Optional[str]
    country_iso2: Optional[str]
    mention: Optional[str]
    confidence: float
    method: str

# ---------- Helpers ----------
def _clean_mention(s: str) -> str:
    s = s.strip()
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"^[,.;:\-–—\(\)\[\]]+|[,.;:\-–—\(\)\[\]]+$", "", s)
    return s

def _fuzzy_best(query: str, choices: List[str], cutoff: int = 85) -> Optional[Tuple[str, int]]:
    if not query: return None
    match = process.extractOne(query, choices, scorer=fuzz.WRatio)
    return (match[0], match[1]) if match and match[1] >= cutoff else None

def _resolve_country(mention: str) -> Optional[Tuple[str, str, float]]:
    m = mention.lower()
    if m in country_name_to_iso2:
        iso2 = country_name_to_iso2[m]
        return (COUNTRIES[iso2]["name"], iso2, 0.95)

    fb = _fuzzy_best(mention, country_names, cutoff=88)
    if fb:
        best, score = fb
        iso2 = country_name_to_iso2[best.lower()]
        conf = min(0.94, 0.70 + (score - 88) * 0.02)
        return (COUNTRIES[iso2]["name"], iso2, conf)
    return None

def _resolve_city(mention: str) -> Optional[Tuple[Dict[str, Any], float]]:
    m = mention.lower()
    if m in JUNK_TOKENS: return None

    candidates = []
    base_conf = 0.0

    if m in city_index:
        candidates = city_index[m]
        base_conf = 0.80
    else:
        fb = _fuzzy_best(mention, city_names, cutoff=90)
        if fb:
            candidates = city_index[fb[0].lower()]
            base_conf = 0.65 + (fb[1] - 90) * 0.02

    if candidates:
        # TIE-BREAKER: Pick the city with the highest population
        # (geonamescache city records usually have a 'population' field)
        best_cand = max(candidates, key=lambda x: x.get('population', 0))
        conf = min(0.92, base_conf + (0.05 if len(candidates) == 1 else 0))
        return (best_cand, conf)

    return None

def _extract_place_mentions(text: str) -> List[str]:
    doc = nlp(text)
    out = []
    seen = set()
    for ent in doc.ents:
        if ent.label_ in ("GPE", "LOC", "FAC"):
            m = _clean_mention(ent.text)
            if m and len(m) >= 2 and m.lower() not in seen:
                out.append(m)
                seen.add(m.lower())
    return out

# ---------- Refined Main Function ----------
def infer_location_from_text(text: str) -> LocationResult:
    mentions = _extract_place_mentions(text)
    
    city_hits = []
    country_hits = []

    for m in mentions:
        # Check for cities first (more specific)
        c_res = _resolve_city(m)
        if c_res:
            city_hits.append((c_res[0], c_res[1], m))
            continue
        
        # Check for countries
        ct_res = _resolve_country(m)
        if ct_res:
            country_hits.append(ct_res + (m,))

    # PRIORITY 1: Best City Found
    if city_hits:
        # Sort by confidence
        city_hits.sort(key=lambda x: x[1], reverse=True)
        best_rec, conf, m_text = city_hits[0]
        iso2 = best_rec.get("countrycode")
        return LocationResult(
            city=best_rec["name"],
            region=best_rec.get("admin1code"),
            country=COUNTRIES.get(iso2, {}).get("name"),
            country_iso2=iso2,
            mention=m_text,
            confidence=conf,
            method="NER->City"
        )

    # PRIORITY 2: Best Country Found
    if country_hits:
        country_hits.sort(key=lambda x: x[2], reverse=True)
        c_name, iso2, conf, m_text = country_hits[0]
        return LocationResult(
            city=None, region=None,
            country=c_name, country_iso2=iso2,
            mention=m_text, confidence=conf,
            method="NER->Country"
        )

    return LocationResult(None, None, None, None, None, 0.0, "NoLocationFound")

if __name__ == "__main__":
    text = "My GP in Pune said it’s standard here in Maharashtra. But in India it’s expensive."
    loc = infer_location_from_text(text)
    print(loc)