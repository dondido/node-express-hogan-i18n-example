
(function($, document) {
    var $document = $(document),
    $mapCanvas,
    map,
    mapOptions,
    $mapDirections;

    var init = function () {
        var script;
        
        $mapCanvas = $("#map-canvas");
        $mapDirections = $("#map-directions");

        if ("google" in window) {
            loadMap();
        } else {
            script = document.createElement('script');
            script.type = 'text/javascript';
            /*
                Google's async scripts do use document.write if we don't pass a callback.
                The script is being loaded asynchronously, which means it's detached from 
                the document parsing state. There is quite literally no way for the 
                javascript engine to know where the document.write should be executed in 
                the page. This is why expose 'loadMap' as a global variable by attaching it
                to the window object and append &callback=loadMap to the Google Maps v3 
                script URL so it won't use document.write anymore.
            */
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=loadMap';
            document.body.appendChild(script);
        }
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
        if (document.readyState === "complete"){
            init();
        } else {
            $document[binder]("click", "#route-btn", suggestRoute)
                [binder]("dataPageRefresh", removePage);
        }
       
    };

    window.loadMap = function (){
        mapOptions = {
            zoom: 14,
            /*
                Default view: downtown Albena, Bulgaria
                Uses the latitude and longitude of a Position object to create the LatLng object.
                This object is used in the rest of the function. 
                In fact, it’ll be used in the getMapOptions to set the center of the Map we’re building. 
            */
            center: new google.maps.LatLng(43.382995,28.098228),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
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
    
    toggleListeners("on");
    
})(jQuery, document);