function initializeMap(){
    // setInterval(myMethod, 1000);
};

function myMethod(){
    if(myMap.getBounds().getNorthEast() !== undefined){
        console.log("map bounds:" + myMap.getBounds().getNorthEast().lat());
    }
}

var map;
// var infowindow = new google.maps.InfoWindow();
// var searchTiles=[]; // Example: {visible: true, rectangle: rectangle)


SearchParty = {};

SearchParty.SearchMap = (function (map_canvas_id, rectangle_width ) {

    var searchMap = {};

    searchTiles=[];

    searchMap.drawMap = function(){
        var default_location = new google.maps.LatLng(59.91373 , 10.789948);
        var myOptions = {
            zoom: 12,
            center: default_location,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        searchMap.map = new google.maps.Map(document.getElementById(map_canvas_id), myOptions);
        myMap = map; // TODO Fjerne denne
    };

    searchMap.bindWindow = function(rectangle,num, google){
        google.maps.event.addListener(rectangle, 'click', function(event) {
            searchTile = searchTiles[num-1];
            if(searchTile.selected === true){
                searchTile.rectangle.setOptions({fillOpacity: 0.0});
                searchTile.selected = false;
            } else {
                searchTile.rectangle.setOptions({fillOpacity: 0.25});
                searchTile.selected = true;
            }
        });
    };

    searchMap.removeRectangles = function(){
        for(var i = 0;i < searchTiles.length;i++){
            searchTiles[i].rectangle.setVisible = false;
        }
    };

    searchMap.drawRectangles = function(rectangle_width){
        var NW =     new google.maps.LatLng(59.94813,  10.561638);
        var width = 90;  // antall fliser borover på kartet
        var height = 30; // antall fliser nedover på kartet

        // var rectangle_width = 300; // in meters

        var NS = google.maps.geometry.spherical.computeOffset(NW,rectangle_width,90);
        var SS = google.maps.geometry.spherical.computeOffset(NW,rectangle_width,180);
        var tileCount = 0;

        for (var i = 0; i < height; i++) {
            SW = google.maps.geometry.spherical.computeOffset(SS,i*rectangle_width,180);
            NE = google.maps.geometry.spherical.computeOffset(NS,i*rectangle_width,180);

            for (var a = 0; a < width; a++) {
                var rectangle = new google.maps.Rectangle();
                var rectBounds = new google.maps.LatLngBounds(SW,NE);
                var rectOptions = {
                    strokeColor: "#198019",
                    strokeOpacity: 0.4,
                    strokeWeight: 1,
                    fillColor: "blue",
                    fillOpacity: 0.0,
                    editable: false,
                    map: searchMap.map,
                    bounds: rectBounds
                };
                rectangle.setOptions(rectOptions);
                searchTiles.push({selected: false, rectangle: rectangle});
                searchMap.bindWindow(rectangle,searchTiles.length,google);

                var SW = google.maps.geometry.spherical.computeOffset(SW,rectangle_width,90);
                var NE = google.maps.geometry.spherical.computeOffset(NE,rectangle_width,90);
            }
        }
    };

    searchMap.drawMap();

    searchMap.drawRectangles(rectangle_width);

    return searchMap;
});
