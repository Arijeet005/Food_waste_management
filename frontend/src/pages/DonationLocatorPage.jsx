import React, { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import api from '../services/api';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [map, position]);

  return null;
}

function DonationLocatorPage() {
  const [kitchenId, setKitchenId] = useState('kitchen-nyc-001');
  const [radiusKm, setRadiusKm] = useState(10);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [status, setStatus] = useState('Waiting for location...');
  const [error, setError] = useState('');

  const mapCenter = useMemo(() => currentPosition || [40.7128, -74.006], [currentPosition]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setCurrentPosition(coords);
        setStatus(`Live location updated: ${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`);
      },
      () => {
        setError('Location access denied or unavailable.');
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const fetchNearbyNgos = async () => {
      if (!currentPosition) return;

      try {
        const [lat, lng] = currentPosition;
        const response = await api.get('/donations/nearby-ngos', {
          params: { lat, lng, radiusKm, kitchenId }
        });
        setNgos(response.data.data.ngos || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load nearby NGOs');
      }
    };

    fetchNearbyNgos();
    const interval = setInterval(fetchNearbyNgos, 15000);

    return () => clearInterval(interval);
  }, [currentPosition, radiusKm, kitchenId]);

  return (
    <div>
      <h1>Nearest NGO Locator</h1>
      <div className="card form-grid">
        <input value={kitchenId} onChange={(e) => setKitchenId(e.target.value)} placeholder="Kitchen ID" />
        <input
          type="number"
          min="1"
          max="100"
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value) || 10)}
          placeholder="Radius (km)"
        />
      </div>

      <div className="card">
        <p>{status}</p>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="card">
        <div className="map-wrap">
          <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="ngo-map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {currentPosition && (
              <Marker position={currentPosition}>
                <Popup>Your live location</Popup>
              </Marker>
            )}

            {ngos.map((ngo) => (
              <Marker
                key={ngo._id}
                position={[ngo.location.coordinates[1], ngo.location.coordinates[0]]}
              >
                <Popup>
                  <strong>{ngo.name}</strong>
                  <br />
                  {ngo.address}
                  <br />
                  Distance: {ngo.distanceKm} km
                  <br />
                  Phone: {ngo.phone}
                  <br />
                  Hours: {ngo.operatingHours}
                </Popup>
              </Marker>
            ))}

            <RecenterMap position={currentPosition} />
          </MapContainer>
        </div>
      </div>

      <div className="card">
        <h3>Nearby NGOs</h3>
        {ngos.length === 0 && <p>No NGOs found in selected radius.</p>}
        {ngos.map((ngo) => (
          <div className="row" key={ngo._id}>
            <strong>{ngo.name}</strong>
            <span>{ngo.distanceKm} km</span>
            <span>{ngo.phone}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonationLocatorPage;
