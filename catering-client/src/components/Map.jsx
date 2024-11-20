import React, { useEffect, useRef } from "react";

const Map = ({ center }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const defaultCenter = { lat: 10.239613, lng: 123.780381 }; // Default location
  const validCenter =
    center && center.length === 2
      ? { lat: center[0], lng: center[1] }
      : defaultCenter;

  const initializeMap = () => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API is not loaded.");
      return;
    }

    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center: validCenter,
          zoom: 15,
        }
      );
    }

    if (markerRef.current) {
      markerRef.current.setPosition(validCenter);
    } else {
      markerRef.current = new window.google.maps.Marker({
        position: validCenter,
        map: mapRef.current,
      });
    }

    mapRef.current.setCenter(validCenter);
  };

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkGoogleMaps); // Stop checking once loaded
          initializeMap();
        }
      }, 100); // Check every 100ms

      return () => clearInterval(checkGoogleMaps); // Cleanup interval on unmount
    } else {
      initializeMap();
    }
  }, [validCenter]);

  return <div id="map" style={{ height: "300px", width: "100%" }}></div>;
};

export default Map;
