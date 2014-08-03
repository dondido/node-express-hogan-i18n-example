(function($) {
    var $document = $(document),
    $mapCanvas,
    map,
    $mapDirections,
    mapOptions = {
        zoom: 14,
        /*
            Default view: downtown Albena, Bulgaria
            Uses the latitude and longitude of a Position object to create the LatLng object.
            This object is used in the rest of the function. 
            In fact, it’ll be used in the MapOptions to set the center of the Map we’re building. 
        */
        center: new google.maps.LatLng(43.382995,28.098228),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var init = function () {
        $mapCanvas = $("#map-canvas");
        $mapDirections = $("#map-directions");
        loadMap();
    };

    var loadMap = function (){
        //  As a container for the map,  a <div> element is used, with an id of "#map-canvas".
        map = new google.maps.Map($mapCanvas[0], mapOptions);
        // marker is added to the map to show the user’s position. Google Maps default icon is used
        var marker = new google.maps.Marker({
            map: map,
            position: map.getCenter()
        });
        var infowindow = new google.maps.InfoWindow({
            content: "<b>Seasons</b><br/>Hotel Guest House<br/> Albena"
        });
        
        infowindow.open(map, marker);
    };

    var removePage = function () {
        toggleListeners("off");
    };

    var createMap = function (start) {
        var travel,
        directionsService = new google.maps.DirectionsService(),
        directionsDisplay = new google.maps.DirectionsRenderer();
        
        // Gelocation fallback: Defaults to Albena, Bulgaria
        start = start || {
            coords: false,
            address: "Albena, Bulgaria"
        };

        travel = {
            origin: (start.coords) ? new google.maps.LatLng(start.lat, start.lng) : start.address,
            destination: mapOptions.center,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
            // Exchanging DRIVING to WALKING above can prove quite amusing :-)
        };

        directionsDisplay.setMap(map);
        directionsDisplay.setPanel($mapDirections[0]);
        directionsService.route(travel, function(result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
            }
        });
    };
    
    /* 
        Geolocation API allows us to built a complete and functional service 
        to track your user’s position and locate them on a map.
    */
    var suggestRoute = function () {
        var $this = $(this);

        if ($mapDirections.is(':empty')) {
            $this.text($this.data("states")[1]);
            // Check for geolocation support    
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    // Success!
                    createMap({
                        coords: true,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                }, createMap);
            } else {
                createMap();
            }
        } else {
            $this.text($this.data("states")[0]);
            loadMap();
        }
    };
    
    var toggleListeners = function (binder){
        $document[binder]("click", "#route-btn", suggestRoute)
            [binder]({
            "ready": init,
            "dataPageRefresh": removePage
        });
    };
    
    toggleListeners("on");
    
})(jQuery);
