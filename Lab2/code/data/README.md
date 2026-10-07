# data

Place `districts.geojson` here (version C from Part 2 of the lab: simplified at 0.001 degrees, coordinate precision 5, EPSG:4326).

The map loads it from `data/districts.geojson`, relative to `index.html`.

**Source:** Pakistan Common Operational Dataset for administrative boundaries (OCHA, Humanitarian Data Exchange; sourced from the World Food Programme). Use the administrative level 2 (district) layer, 160 features. The code expects the fields `district`, `province`, `pop_2023` and `area_km2`; the original dataset uses `ADM2_EN`, `ADM1_EN` and a P-code, which the LMS copy has already renamed.
