# data

`districts.geojson` is the district layer the map loads, from `data/districts.geojson` relative to `index.html`.

**Source:** Pakistan Common Operational Dataset for administrative boundaries (OCHA, Humanitarian Data Exchange; sourced from the World Food Programme), file `pak_admin2.geojson`: administrative level 2, 160 districts.

**How it was prepared** (version C from Part 2 of the lab):

- Simplified with a 100 m tolerance using topology-aware simplification, so neighbouring districts still share exact borders (no gaps or overlaps)
- Coordinates rounded to 5 decimal places, EPSG:4326
- Fields renamed to match the handout: `adm2_name` → `district`, `adm1_name` → `province`, `adm2_pcode` → `pcode`, `area_sqkm` → `area_km2` (rounded to 0.1 km²)
- `pop_2023` joined from the 2023 Population Census district table (Pakistan Bureau of Statistics), as published in the [PakPC2023](https://github.com/myaseen208/PakPC2023) R package (`PakPC2023PakDist`), matched by district name

Size: 0.93 MB, down from 10.1 MB for the original file.

**Population notes**

- 135 of 160 districts have a value; all 136 census rows are used and the joined total, 241,499,431, equals the census total.
- No value (`null`, drawn grey as "no census data"): the 10 districts of Azad Kashmir and 14 of Gilgit-Baltistan, which the 2023 census did not cover, and Lehri (Balochistan), which the census does not list separately.
- West Karachi = census Karachi West + Keamari, because Keamari was split from Karachi West in 2020 and is not a separate polygon in the boundary file.
- Name differences matched by hand: Leiah = Layyah, D. I. Khan = Dera Ismail Khan, Shaheed Sikandarabad = Surab, Malakand = Malakand Protected Area, Tor Ghar = Torghar, Islamabad = ICT, upper/lower Chitral and Kohistan, and the Karachi districts.
