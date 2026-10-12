// District Dashboard: the finished app.js from Lab 3 (Parts 3 to 9).
// Each block is labelled with the Part of the handout that adds it.

// ---------------------------------------------------------------
// Part 9 (extension): open the page as index.html?canvas to draw
// the vectors on a canvas instead of as SVG elements.
// ---------------------------------------------------------------
const useCanvas = new URLSearchParams(window.location.search).has('canvas');

// ---------------------------------------------------------------
// Part 3: the map, its options, and three basemaps
// ---------------------------------------------------------------
const map = L.map('map', {
  center: [30.3753, 69.3451],
  zoom: 5,
  minZoom: 5,
  maxZoom: 14,
  maxBounds: [[21.5, 58.5], [39.0, 80.5]],
  maxBoundsViscosity: 1.0,
  preferCanvas: useCanvas
});

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
});

const positron = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 19,
  subdomains: 'abcd',
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
});

// Esri's template is {y}/{x}, the other way round from the two above
const imagery = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: 'Tiles &copy; Esri'
});

positron.addTo(map);

// Basemaps are radio buttons. Overlays are added in Parts 4 and 6.
const layerControl = L.control.layers(
  {
    'Light (Carto Positron)': positron,
    'OpenStreetMap': osm,
    'Satellite (Esri)': imagery
  },
  {},
  { collapsed: false }
).addTo(map);

L.control.scale({ imperial: false }).addTo(map);

// ---------------------------------------------------------------
// Part 4: shade by density, a rate, not by population, a count
// ---------------------------------------------------------------
function show(value) {
  if (value === null || value === undefined || value === '') {
    return 'not recorded';
  }
  return typeof value === 'number' ? value.toLocaleString() : value;
}

function densityOf(p) {
  if (p.pop_2023 === null || p.pop_2023 === undefined) return null;
  return p.pop_2023 / p.area_km2;
}

function colourFor(density) {
  if (density === null) return '#c9cfd1';
  if (density > 1000) return '#08306b';
  if (density >  400) return '#2171b5';
  if (density >  150) return '#4292c6';
  if (density >   50) return '#9ecae1';
  return '#deebf7';
}

function styleFor(feature) {
  return {
    color: '#ffffff',
    weight: 1,
    fillColor: colourFor(densityOf(feature.properties)),
    fillOpacity: 0.8
  };
}

// ---------------------------------------------------------------
// Part 5: an info panel that follows the pointer
// ---------------------------------------------------------------
const info = L.control({ position: 'topright' });

info.onAdd = function () {
  this._div = L.DomUtil.create('div', 'info');
  L.DomEvent.disableClickPropagation(this._div);
  L.DomEvent.disableScrollPropagation(this._div);
  this.update();
  return this._div;
};

info.update = function (p) {
  const zoom = '<div class="muted">Zoom level ' + map.getZoom() + '</div>';
  if (!p) {
    this._div.innerHTML = '<h4>District</h4>' +
      '<div class="muted">Hover over a district</div>' + zoom;
    return;
  }
  const d = densityOf(p);
  this._div.innerHTML =
    '<h4>' + p.district + '</h4>' +
    p.province + '<br>' +
    'Population: ' + show(p.pop_2023) + '<br>' +
    'Area: ' + show(p.area_km2) + ' km<sup>2</sup><br>' +
    'Density: ' + (d === null ? 'not recorded'
                              : Math.round(d).toLocaleString() + ' per km<sup>2</sup>') +
    zoom;
};

info.addTo(map);

// ---------------------------------------------------------------
// Part 5: hover highlighting and click to zoom
// ---------------------------------------------------------------
function highlight(e) {
  e.target.setStyle({ weight: 3, color: '#1a202c', fillOpacity: 0.95 });
  e.target.bringToFront();
  info.update(e.target.feature.properties);
}

function unhighlight(e) {
  districts.resetStyle(e.target);
  info.update();
}

function zoomToDistrict(e) {
  map.fitBounds(e.target.getBounds(), { padding: [20, 20] });
}

function bindDistrict(feature, layer) {
  layer.bindTooltip(feature.properties.district, { sticky: true });
  layer.on({
    mouseover: highlight,
    mouseout: unhighlight,
    click: zoomToDistrict
  });
}

// ---------------------------------------------------------------
// Part 6: population as proportional circles, in their own pane
// ---------------------------------------------------------------
// A pane above the default overlayPane (400), so the circles always
// sit on top of the district polygons
map.createPane('symbols');
map.getPane('symbols').style.zIndex = 450;

// Circle AREA should follow population, so the radius follows its root
function radiusFor(population) {
  return Math.sqrt(population) / 160;
}

function circleFor(feature, latlng) {
  return L.circleMarker(latlng, {
    pane: 'symbols',
    radius: radiusFor(feature.properties.pop_2023),
    color: '#7c2d12',
    weight: 1,
    fillColor: '#f97316',
    fillOpacity: 0.7
  }).bindTooltip(
    feature.properties.district + ': ' +
    feature.properties.pop_2023.toLocaleString()
  );
}

function hasPopulation(feature) {
  return feature.properties.pop_2023 !== null;
}

// ---------------------------------------------------------------
// Parts 4 and 6: the layer control holds groups. draw() empties and
// refills them, so the control never points at a stale layer.
// ---------------------------------------------------------------
const districtGroup = L.featureGroup().addTo(map);
layerControl.addOverlay(districtGroup, 'Population density');

const circleGroup = L.featureGroup().addTo(map);
layerControl.addOverlay(circleGroup, 'Population');

// Part 6: metres on the ground against pixels on the screen
const nust = [33.6423, 72.9906];
const nustGroup = L.featureGroup([
  L.circle(nust, { radius: 25000, color: '#0f766e', weight: 2, fillOpacity: 0.08 }),
  L.circleMarker(nust, { radius: 6, color: '#0f766e', fillColor: '#0f766e', fillOpacity: 1 })
]).bindTooltip('NUST H-12: a 25 km circle and a 6 pixel circleMarker');
layerControl.addOverlay(nustGroup, 'NUST, 25 km');

// ---------------------------------------------------------------
// Part 4: draw the layers, keeping only the chosen province.
// Part 6 adds the circles; Part 8 adds the drop-down.
// ---------------------------------------------------------------
let allDistricts = null;
let allPoints = null;
let districts = null;   // the current L.geoJSON layer, kept for resetStyle

function draw(province) {
  const t0 = performance.now();   // Part 9: timing
  const keep = function (feature) {
    return province === 'all' || feature.properties.province === province;
  };

  districtGroup.clearLayers();
  circleGroup.clearLayers();

  districts = L.geoJSON(allDistricts, {
    filter: keep,
    style: styleFor,
    onEachFeature: bindDistrict
  });
  districtGroup.addLayer(districts);

  circleGroup.addLayer(L.geoJSON(allPoints, {
    filter: function (f) { return keep(f) && hasPopulation(f); },
    pointToLayer: circleFor
  }));

  const n = districts.getLayers().length;
  if (n > 0) {
    map.fitBounds(districts.getBounds());
  }
  document.getElementById('count').textContent = n + ' districts';
  // Part 9: how long did that take?
  console.log('draw(' + province + '): ' + n + ' districts in ' +
              (performance.now() - t0).toFixed(1) + ' ms, ' +
              (useCanvas ? 'canvas' : 'SVG'));
}

// Part 8 (extension): the province drop-down
function fillProvinceList() {
  const select = document.getElementById('province');
  const provinces = [...new Set(
    allDistricts.features.map(f => f.properties.province)
  )].sort();
  for (const name of provinces) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  }
}

document.getElementById('province')
  .addEventListener('change', function (event) {
    draw(event.target.value);
  });

// ---------------------------------------------------------------
// Part 7: map events, and switching a handler on and off
// ---------------------------------------------------------------
// A named function, so that map.off can find it again
function showCoordinates(e) {
  L.popup()
    .setLatLng(e.latlng)
    .setContent(e.latlng.lat.toFixed(4) + ', ' + e.latlng.lng.toFixed(4))
    .openOn(map);
}

document.getElementById('coords')
  .addEventListener('change', function (event) {
    if (event.target.checked) {
      map.on('click', showCoordinates);
    } else {
      map.off('click', showCoordinates);
    }
  });

map.on('zoomend', function () {
  info.update();
});

// ---------------------------------------------------------------
// Part 4: legend. Part 6 adds the circle sizes.
// ---------------------------------------------------------------
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  const div = L.DomUtil.create('div', 'legend');
  const breaks = [0, 50, 150, 400, 1000];
  const labels = ['under 50', '50 to 150', '150 to 400', '400 to 1,000', 'over 1,000'];

  div.innerHTML = '<strong>People per km<sup>2</sup></strong><br>';
  for (let i = 0; i < breaks.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colourFor(breaks[i] + 1) + '"></i> ' +
      labels[i] + '<br>';
  }
  div.innerHTML += '<i style="background:' + colourFor(null) + '"></i> no census data';

  // Part 6: reference circles drawn with the same radiusFor() as the
  // map, nested on one base line, each labelled by a leader line
  const sizes = [10000000, 4000000, 1000000];
  const rMax = radiusFor(sizes[0]);
  const pad = 6;
  const base = pad + 2 * rMax;
  let svg = '<svg width="' + (2 * rMax + 75) + '" height="' + (base + 2) + '">';
  for (const s of sizes) {
    const r = radiusFor(s);
    const top = base - 2 * r;
    svg += '<circle cx="' + (rMax + 1) + '" cy="' + (base - r) + '" r="' + r +
           '" fill="#f97316" fill-opacity=".2" stroke="#7c2d12"/>' +
           '<line x1="' + (rMax + 1) + '" y1="' + top + '" x2="' + (2 * rMax + 14) +
           '" y2="' + top + '" stroke="#7c2d12" stroke-width=".6"/>' +
           '<text x="' + (2 * rMax + 17) + '" y="' + (top + 3.5) +
           '" font-size="10">' + (s / 1000000) + ' million</text>';
  }
  svg += '</svg>';
  div.innerHTML += '<div class="circles"><strong>Population</strong>' + svg + '</div>';

  L.DomEvent.disableClickPropagation(div);
  return div;
};

legend.addTo(map);

// ---------------------------------------------------------------
// Part 4: load both files, then draw
// ---------------------------------------------------------------
async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(path + ': status ' + response.status);
  }
  return response.json();
}

async function loadData() {
  try {
    [allDistricts, allPoints] = await Promise.all([
      loadJSON('data/districts.geojson'),
      loadJSON('data/district_points.geojson')
    ]);
  } catch (err) {
    console.error('Could not load the data.', err);
    document.getElementById('count').textContent = 'data failed to load';
    return;
  }

  fillProvinceList();
  draw('all');
}

loadData();
