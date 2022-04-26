import {locations as locationsData} from './hotelLocations.js';

function initMap() {

    const htmlMap = document.getElementById("map");

    const map = new google.maps.Map(
        htmlMap, 
        {
            zoom: 6,
            center: locationsData[1],
        });
    

    const svgMarker = {
        path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
        fillColor: "blue",
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30),
        };
    
    // var marker = new google.maps.Marker({
    //     map: map
    // });
    
    // let marker;

    var infoWindow = new google.maps.InfoWindow();

    for (let i = 0; i < locationsData.length; i++) {

        let pos = {}
        pos.lat = locationsData[i].lat;
        pos.lng = locationsData[i].lng;

        const marker = new google.maps.Marker({
            position: pos,
            icon: svgMarker,
            map: map,
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infoWindow.setContent(locationsData[i].info);
                infoWindow.open(map, marker);
            }
        })(marker, i));
    }

    /** POSICION DEL USUARIO */
    let pos;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent("Your position.");
                infoWindow.open(map);
                map.setCenter(pos);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
            browserHasGeolocation
                ? "Error: The Geolocation service failed."
                : "Error: Your browser doesn't support geolocation."
        );
            infoWindow.open(map);
    }


    /** LISTADO DE DISTANCIAS */
    const locationButton = document.createElement("button");

    locationButton.textContent = "SHOW LIST OF DISTANCES ";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    locationButton.addEventListener("click", () => {
        const service = new google.maps.DistanceMatrixService();
        const origin = pos;
        const destinations = locationsData;

        const request = {
            origins: [origin],
            destinations: destinations,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
        }

        // get distance matrix response
        service.getDistanceMatrix(request).then((response) => {
            // put response
            document.getElementById("distances").innerText = JSON.stringify(
                response,
                null,
                2
            );
        });
    });
    
}

window.initMap = initMap;
