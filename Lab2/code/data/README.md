# data

`districts.geojson` is the district layer the map loads, from `data/districts.geojson` relative to `index.html`.

**Source:** Pakistan Common Operational Dataset for administrative boundaries (OCHA, Humanitarian Data Exchange; sourced from the World Food Programme), file `pak_admin2.geojson`: administrative level 2, 160 districts.

**How it was prepared** (version C from Part 2 of the lab):

- Simplified with a 100 m tolerance using topology-aware simplification, so neighbouring districts still share exact borders (no gaps or overlaps)
- Coordinates rounded to 5 decimal places, EPSG:4326
- Fields renamed to match the handout: `adm2_name` → `district`, `adm1_name` → `province`, `adm2_pcode` → `pcode`, `area_sqkm` → `area_km2` (rounded to 0.1 km²)

Size: 0.93 MB, down from 10.1 MB for the original file.

**Population is not included yet.** The source boundaries have no population field, so every district currently draws in the lowest class and the popup shows "not recorded". Join 2023 census figures by `pcode` as `pop_2023` to complete the choropleth.
