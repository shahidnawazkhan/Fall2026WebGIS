# Lab 4: GeoDjango, PostGIS and Leaflet

Installing Django, switching it from SQLite to PostgreSQL with PostGIS, a first look at the Django admin panel, and a first Leaflet map that displays data served by GeoDjango.

| Path | Contents |
|------|----------|
| `Lab4_GeoDjango_Getting_Started.pdf` | Lab handout (compiled PDF) |
| `Lab4_GeoDjango_Getting_Started.tex` | Lab handout (LaTeX source, compile with pdfLaTeX) |
| `index.html` | Lab page on the course website |
| `img/` | Screenshots of the finished project, used on the lab page |
| `code/` | The finished Django project from the lab |

## The reference project in `code/`

| Path | Contents |
|------|----------|
| `requirements.txt` | Django 6.1 and the psycopg PostgreSQL driver (tested on Python 3.13 and 3.14) |
| `webgis/settings.py` | PostGIS database, `django.contrib.gis`, and the OSGeo4W setup GeoDjango needs on Windows |
| `districts/models.py` | The `District` model with a `MultiPolygonField` |
| `districts/load.py` | Loads `data/districts.geojson` into PostGIS |
| `districts/admin.py` | The district list, filter, search and map editor in the admin |
| `districts/views.py` | The map page, a GeoJSON API, and a "which district is this point in" query |
| `districts/templates/districts/map.html` | The Leaflet map |

Unlike Labs 1 to 3, this project needs a running Django server and a PostgreSQL database, so it cannot be hosted on GitHub Pages. Run it on your own machine:

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
setx WEBGIS_DB_PASSWORD "your-postgres-password"   # then open a new terminal
python manage.py migrate
python manage.py shell -c "from districts import load; load.run()"
python manage.py createsuperuser
python manage.py runserver
```

Then open http://127.0.0.1:8000/ for the map and http://127.0.0.1:8000/admin/ for the admin.
