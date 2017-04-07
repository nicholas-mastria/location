map = null;
marker = null;
pinYellow = null;
pinGreen = null;
pinRed = null;
infowindow = null;

appMachine = {lat: -21.7725621, lng: -43.3469667};

$( document ).ready(function() {

    map = new google.maps.Map(document.getElementById('mapContainer'), {
        zoom: 14,
        center: appMachine,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        styles: [{featureType: "road", stylers: [ {visibility: "off"} ] }]
    });

    pinYellow = new google.maps.MarkerImage('pins/png/pin-yellow-3.png',
        null,
        null,
        new google.maps.Point(8, 25),
        new google.maps.Size(14, 25)
    );
    pinGreen = new google.maps.MarkerImage('pins/png/pin-green-3.png',
        null,
        null,
        new google.maps.Point(8, 25),
        new google.maps.Size(14, 25)
    );
    pinRed = new google.maps.MarkerImage('pins/png/pin-red-3.png',
        null,
        null,
        new google.maps.Point(8, 25),
        new google.maps.Size(14, 25)
    );

    marker = new google.maps.Marker({
        position: appMachine,
        map: map,
        icon: pinYellow,
        title: "App Machine"
    });

    infowindow = new google.maps.InfoWindow({content: 	"<p><b>Waiting location...</b>"+
	    												"<hr/>Chrome or Safari HTTPS only (secure website)"+
	    												"<br/>for HTTP try Firefox or IE Browser"+
	    												"</p>"});

    google.maps.event.addListener(marker, 'mouseover', (function(marker) {
        return function() {
            infowindow.open(map, marker);
        }
    })(marker));

    getLocation();

});

function getLocation() {
  if (navigator.geolocation) {

  	// This fail on non HTTP sites with Chrome and Safari
    navigator.geolocation.getCurrentPosition(showPosition, errorMsg);
    //navigator.geolocation.getCurrentPosition(showPosition, errorMsg, enableHighAccuracy:true);
	// Alternative using API
	//jQuery.post( "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDDn4i8t7hw9VjbsbNdaJ0qLTzGQNMl6Us", function(success) {
	//	showPosition({coords: {latitude: success.location.lat, longitude: success.location.lng}});
	//})
	//.fail(function(err) {
	//    marker.setIcon(pinRed);
	//    marker.setTitle("No Location Information");
	//    infowindow.setContent("<p><b>Geolocation is not supported by this browser or API is not enabled</b></p>");
	//});
  } 
  else {
    marker.setIcon(pinRed);
    marker.setTitle("App Machine");
    infowindow.setContent("<p><b>Geolocation is not supported by this browser</b></p>");
  }
}

function errorMsg(msg) {
    marker.setIcon(pinRed);
    marker.setTitle("App Machine");
    infowindow.setContent(	"<p><b>Error accessing GeoLocation functions</b>"+
							"<hr/>Chrome or Safari HTTPS only (secure website)"+
							"<br/>for HTTP try Firefox or IE Browser"+
							"</p>");
}

function showPosition(position) {
	var positionLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
	var p1 = new LatLon(appMachine.lat, appMachine.lng);
	var p2 = new LatLon(positionLatLng.lat, positionLatLng.lng);
    var dist = p1.distanceTo(p2);
	map.setCenter(positionLatLng);
	marker.setPosition(positionLatLng);
	marker.setIcon(pinGreen);
    marker.setTitle("Your Location");
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({ 'latLng': positionLatLng }, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				infowindow.setContent(	'<p><b>Location Found</b>'+
					                    '<hr/>Latitude: '+(Math.round(positionLatLng.lat * 10000)/10000).toFixed(4)+
					                    ' / Longitude: '+(Math.round(positionLatLng.lng * 10000)/10000).toFixed(4)+
					                    '<br/>Distance to App Machine: '+(Math.round(dist * 10)/10).toFixed(1)+' Km'+
					                    '<br/>Address: '+results[0].formatted_address+
					                    '</p>');
			}
			else {
				infowindow.setContent(	'<p><b>Location Found</b>'+
					                    '<hr/>Latitude: '+(Math.round(positionLatLng.lat * 10000)/10000).toFixed(4)+
					                    ' / Longitude: '+(Math.round(positionLatLng.lng * 10000)/10000).toFixed(4)+
					                    '<br/>Distance to App Machine: '+(Math.round(dist * 10)/10).toFixed(1)+' Km'+
					                    "<br/>Can't get Location Address"+
					                    '</p>');
			}
		}
		else {
			infowindow.setContent(	'<p><b>Location Found</b>'+
					                    '<hr/>Latitude: '+(Math.round(positionLatLng.lat * 10000)/10000).toFixed(4)+
					                    ' / Longitude: '+(Math.round(positionLatLng.lng * 10000)/10000).toFixed(4)+
					                '<br/>Distance to App Machine: '+(Math.round(dist * 10)/10).toFixed(1)+' Km'+
				                    "<br/>Can't get Location Address"+
				                    '</p>');
		}
	});
}

