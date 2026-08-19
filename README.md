# Coverage Map

A standalone MapLibre-based coverage-map frontend.

## Files

- `index.html` — page structure and controls
- `style.css` — responsive UI styling
- `app.js` — map initialization, layer controls, and location search

## Coverage sources

`app.js` contains three empty source fields:

```js
sources: {
  lte: '',
  fiveg: '',
  uw: ''
}
```

Populate these with GIS sources you are authorized to use. The frontend supports GeoJSON sources as written. Vector-tile sources require a MapLibre vector source configuration instead.

## Run locally

Serve the directory with any static HTTP server, then open `index.html`. For example, with Python:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/`.
