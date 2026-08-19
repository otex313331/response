const CONFIG={center:[-83.22,42.31],zoom:8,colors:{lte:'#2563eb',fiveg:'#8b5cf6',uw:'#22c55e'},sources:{lte:'',fiveg:'',uw:''}};

const map=new maplibregl.Map({container:'map',style:{version:8,sources:{basemap:{type:'raster',tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],tileSize:256,attribution:'© OpenStreetMap contributors'}},layers:[{id:'basemap',type:'raster',source:'basemap'}]},center:CONFIG.center,zoom:CONFIG.zoom});
map.addControl(new maplibregl.NavigationControl(),'bottom-right');

function addGeoJsonLayer(id,url,color){if(!url)return;map.addSource(id,{type:'geojson',data:url});map.addLayer({id,type:'fill',source:id,paint:{'fill-color':color,'fill-opacity':.55,'fill-outline-color':color}})}
function toggleLayer(id,visible){if(map.getLayer(id))map.setLayoutProperty(id,'visibility',visible?'visible':'none')}

map.on('load',()=>{
 addGeoJsonLayer('coverage-lte',CONFIG.sources.lte,CONFIG.colors.lte);
 addGeoJsonLayer('coverage-5g',CONFIG.sources.fiveg,CONFIG.colors.fiveg);
 addGeoJsonLayer('coverage-uw',CONFIG.sources.uw,CONFIG.colors.uw);
});

async function searchLocation(){const input=document.getElementById('location');const q=input.value.trim();if(!q)return;try{const response=await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(q),{headers:{Accept:'application/json'}});const results=await response.json();if(!results.length){alert('Location not found.');return}map.flyTo({center:[Number(results[0].lon),Number(results[0].lat)],zoom:11});}catch(error){console.error(error);alert('Location search failed.')}}

document.getElementById('location').addEventListener('keydown',event=>{if(event.key==='Enter')searchLocation()});