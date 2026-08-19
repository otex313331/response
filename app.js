const CONFIG = {
    center: [-83.22, 42.31],
    zoom: 8,
    colors: {
        lte: '#2563eb',
        fiveg: '#8b5cf6',
        cband: '#a855f7',
        uw: '#22c55e'
    },
    // Public map style source identified from the captured style.
    // The Mapbox token is supplied by the browser at runtime rather than stored here.
    vectorSource: 'mapbox://gismaps.3knn09ds,gismaps.2x81tn8t,mapbox.mapbox-streets-v8,gismaps.aq7mk519,gismaps.1n3iu3g7,mapbox.country-boundaries-v1,gismaps.cbihlc9h,gismaps.7is2087g'
};

const map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            basemap: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors'
            }
        },
        layers: [
            { id: 'basemap', type: 'raster', source: 'basemap' }
        ]
    },
    center: CONFIG.center,
    zoom: CONFIG.zoom
});

map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

function addCoverageLayers() {
    if (map.getSource('verizon-coverage')) return;

    map.addSource('verizon-coverage', {
        type: 'vector',
        url: CONFIG.vectorSource
    });

    // Exact source-layer names from the captured map style.
    const layers = [
        {
            id: 'coverage-lte',
            sourceLayer: 'vzw4glte',
            color: CONFIG.colors.lte
        },
        {
            id: 'coverage-5g',
            sourceLayer: 'vzw5gnw',
            color: CONFIG.colors.fiveg
        },
        {
            id: 'coverage-cband',
            sourceLayer: 'vzw5gcband',
            color: CONFIG.colors.cband
        },
        {
            id: 'coverage-uw',
            sourceLayer: 'vzw5guwb',
            color: CONFIG.colors.uw
        }
    ];

    for (const layer of layers) {
        map.addLayer({
            id: layer.id,
            type: 'fill',
            source: 'verizon-coverage',
            'source-layer': layer.sourceLayer,
            paint: {
                'fill-color': layer.color,
                'fill-opacity': 0.55,
                'fill-outline-color': layer.color
            }
        });
    }
}

function toggleLayer(id, visible) {
    if (!map.getLayer(id)) return;
    map.setLayoutProperty(id, 'visibility', visible ? 'visible' : 'none');
}

map.on('load', () => {
    try {
        addCoverageLayers();
    } catch (error) {
        console.error('Coverage source could not be loaded:', error);
    }
});

async function searchLocation() {
    const input = document.getElementById('location');
    const query = input.value.trim();
    if (!query) return;

    try {
        const response = await fetch(
            'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(query),
            { headers: { Accept: 'application/json' } }
        );

        const results = await response.json();

        if (!results.length) {
            alert('Location not found.');
            return;
        }

        map.flyTo({
            center: [Number(results[0].lon), Number(results[0].lat)],
            zoom: 11
        });
    } catch (error) {
        console.error(error);
        alert('Location search failed.');
    }
}

document.getElementById('location').addEventListener('keydown', event => {
    if (event.key === 'Enter') searchLocation();
});