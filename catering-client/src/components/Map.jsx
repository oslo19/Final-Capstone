import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultCenter = [37.7749, -122.4194]; // San Francisco coordinates

const isValidCoordinates = (coords) => {
  return (
    Array.isArray(coords) &&
    coords.length === 2 &&
    coords.every((value) => typeof value === 'number')
  );
};

const Map = ({ center }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const validCenter = isValidCoordinates(center) ? center : defaultCenter;

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(validCenter, 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    if (markerRef.current) {
      markerRef.current.setLatLng(validCenter);
    } else {
      markerRef.current = L.marker(validCenter).addTo(mapRef.current);
    }

    mapRef.current.setView(validCenter, 15);
  }, [validCenter]);

  return (
    <div id="map" style={{ height: '300px', width: '100%', zIndex: '1' }}></div>
  );
};

export default Map;
