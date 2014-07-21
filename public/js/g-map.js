function initialize() {
    var myOptions = {
        zoom: 14,
        center: new google.maps.LatLng(40.805478, -73.96522499999998),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(40.805478, -73.96522499999998)
    });
    infowindow = new google.maps.InfoWindow({
        content: "<b>The Breslin</b><br/>2880 Broadway<br/> New York"
    });
    google.maps.event.addListener(marker, "click", function () {
        infowindow.open(map, marker);
    });
    infowindow.open(map, marker);
}
google.maps.event.addDomListener(window, 'load', initialize);
