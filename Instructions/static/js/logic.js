queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


// satellite background.
var satellitemap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

// outdoors background.
var outdoors_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

// map object to an array of layers we created.
var map = L.map("map", {
  center: [35.09, -25.71],
  zoom: 2,
  layers: [satellitemap_background, outdoors_background]
});

// adding one 'graymap' tile layer to the map.
satellitemap_background.addTo(map);

// layers for one set of data,tectonicplates.

var earthquakes = new L.LayerGroup();

// base layers
var baseMaps = {
  Satellite: satellitemap_background,
  Outdoors: outdoors_background
};

// overlays 
var overlayMaps = {
  "Earthquakes": earthquakes
};

// control which layers are visible.
L
  .control
  .layers(baseMaps, overlayMaps)
  .addTo(map);
d3.json(queryUrl).then(function(data){
    console.log(data)

var geometry = data.features
// define color gradients
for(var i=0; i< geometry.length; i++){
        var color = "";
    if (geometry[i].geometry.coordinates[2] > 20) {
        color = "red";
    }
    else if (geometry[i].geometry.coordinates[2] > 10) {
        color = "green";
    }
    else if (geometry[i].geometry.coordinates[2] > 5) {
        color = "orange";
    }
    else {
        color = "yellow";
    }
  // add circular markers
    var lat = geometry[i].geometry.coordinates[1]
    var lng = geometry[i].geometry.coordinates[0]
    L.circle([lat,lng],{
        color: "black",
        fillColor: color,
        fillOpacity: 0.8,
        radius: 100000,
        radius: (geometry[i].properties.mag)*80000
    }
    ).bindPopup(`<h3>${geometry[i].properties.place}</h3><hr><p>${(geometry[i].properties.status)}</p><hr><p>${(geometry[i].properties.time)}</p>`).addTo(map)
};
function getColor(d) {
    return d > 20   ? 'red' :
           d > 10   ? 'green' :
           d > 5   ? 'orange' :
                      'yellow';
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 5, 10, 20],
    labels = [];

    div.innerHTML+='Magnitude<br><hr>'

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(map);
})

  