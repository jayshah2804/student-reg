import { useRef } from "react";
import React from "react";
import "./Address.css";

let lat;
let lng;
let current = "";
const Address = (props) => {
  const pickupAddressRef = useRef();
  const dropAddressRef = useRef();
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq88vEj-mQ9idalgeP1IuvulowkkFA-Nk&callback=initMap&libraries=places&v=weekly";
  script.async = true;

  document.body.appendChild(script);
  let myInt = setInterval(() => {
    if (document.getElementsByClassName("gm-svpc")[0]) {
      document.getElementsByClassName("gm-svpc")[0].style.display = "none";
      document.getElementsByClassName("gm-control-active")[0].style.display =
        "none";
      clearInterval(myInt);
    }
  });

  function initMap() {
    var map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 23.0225, lng: 72.5714 },
      zoom: 11,
      mapTypeControl: false,
    });
    var input1 = document.getElementById("pac-input1");
    var input2 = document.getElementById("pac-input2");

    var autocomplete = [];
    autocomplete[0] = new window.google.maps.places.Autocomplete(input1);
    autocomplete[1] = new window.google.maps.places.Autocomplete(input2);
    var geocoder = new window.google.maps.Geocoder();

    autocomplete[0].bindTo("bounds", map);
    autocomplete[1].bindTo("bounds", map);
    var infowindow = new window.google.maps.InfoWindow();
    var infowindowContent = document.getElementById("infowindow-content");
    infowindow.setContent(infowindowContent);
    var marker = new window.google.maps.Marker({
      map: map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      anchorPoint: new window.google.maps.Point(0, -29),
    });

    window.google.maps.event.addListener(marker, "dragend", function (marker) {
      geocoder.geocode(
        {
          latLng: marker.latLng,
        },
        function (value) {
          infowindowContent.children["place-address"].textContent =
            value[0].formatted_address;
          infowindowContent.children["place-name"].textContent = "";
          if (current === "pickup")
            pickupAddressRef.current.value = value[0].formatted_address;
          else dropAddressRef.current.value = value[0].formatted_address;
          addressChangeHandler();
        }
      );
      console.log(marker.formatted_address);
      lat = marker.latLng.lat();
      lng = marker.latLng.lng();
    });

    for (let i = 0; i < 2; i++) {
      autocomplete[i].addListener("place_changed", function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete[i].getPlace();
        if (!place.geometry || !place.geometry.location) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }
        if (place.geometry.viewport) {
          console.log(place.geometry.location);
          map.setCenter(place.geometry.location);
          map.setZoom(18);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(13);
        }
        console.log(place.geometry.location);
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        lat = marker.getPosition().lat();
        lng = marker.getPosition().lng();
        console.log(marker.getPosition().lat());
        console.log(marker.getPosition().lng());
        infowindowContent.children["place-name"].textContent = place.name;
        infowindowContent.children["place-address"].textContent =
          place.formatted_address;
        infowindow.open(map, marker);
      });
    }
  }
  window.initMap = initMap;

  const addressChangeHandler = () => {
    // setTimeout(() => {
    //   if (addressRef.current.value)
    //     props.addressEntered(addressRef.current.value, lat, lng);
    // }, 500);
  };

  return (
    <div style={{height: "100%"}}>
      <h4 className="sub-header-title">Bus Stop Details</h4>
      <div id="pac-container">
        <input
          id="pac-input1"
          type="text"
          ref={pickupAddressRef}
          placeholder="Enter pickup stop"
          className="tags address"
          onChange={() => (current = "pickup")}
          onBlur={addressChangeHandler}
        />
        <br />
        <input
          id="pac-input2"
          type="text"
          ref={dropAddressRef}
          placeholder="Enter drop stop"
          className="tags address"
          onChange={() => (current = "drop")}
        //   onBlur={addressChangeHandler}
        />
      </div>
      <div id="map"></div>
      <div id="infowindow-content">
        <span id="place-name" className="title"></span>
        <br />
        <span id="place-address"></span>
      </div>
    </div>
  );
};

export default React.memo(Address);
