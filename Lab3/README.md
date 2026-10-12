# Lab 3: District Dashboard

Building on Lab 2: three basemaps and a layer control, districts shaded by population density with hover highlighting and an info panel, population as proportional circles in their own pane, map events switched on and off, and (as extensions) a province filter and an SVG against canvas measurement.

| Path | Contents |
|------|----------|
| `Lab3_District_Dashboard.pdf` | Lab handout (compiled PDF) |
| `Lab3_District_Dashboard.tex` | Lab handout (LaTeX source, compile with pdfLaTeX) |
| `index.html` | Lab page on the course website |
| `code/index.html` | Page structure |
| `code/style.css` | Page styling, including the info panel and legend |
| `code/app.js` | The finished dashboard; each block is labelled with the Part that adds it |
| `code/data/districts.geojson` | District polygons with 2023 census population (same file as Lab 2) |
| `code/data/district_points.geojson` | One point per district, placed with Point on Surface so it falls inside the polygon |

Open `code/index.html?canvas` to draw the vectors on a canvas instead of as SVG (Part 9).

To run the code, open the `code` folder in VS Code and start it with **Live Server**.
