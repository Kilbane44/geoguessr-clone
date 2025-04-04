import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
// Remove the direct import to avoid potential bundling issues
// import * as Mapillary from 'mapillary-js';

// Fix for Leaflet marker icons
let markerIcon, markerShadow;
try {
  markerIcon = require('leaflet/dist/images/marker-icon.png');
  markerShadow = require('leaflet/dist/images/marker-shadow.png');
} catch (e) {
  // Fallback to CDN URLs if import fails
  markerIcon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
  markerShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
}

// Fix the Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Debug mode flag
if (typeof window !== 'undefined' && !window.hasOwnProperty('debugMode')) {
  window.debugMode = false;
}

// Debug logger
const debugLog = (message, data) => {
  if (window.debugMode) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

// Component to set up map click events using the useMap hook
function MapEvents({ onClick }) {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      map.on('click', onClick);
    }
    
    return () => {
      if (map) {
        map.off('click', onClick);
      }
    };
  }, [onClick, map]);
  
  return null;
}

// Define verified locations for Google Street View
const VERIFIED_LOCATIONS = [
  { lat: 40.7812, lng: -73.9665, name: 'Central Park, New York' },
  { lat: 51.5007, lng: -0.1246, name: 'London Eye, London' },
  { lat: 35.6895, lng: 139.6917, name: 'Shinjuku, Tokyo' },
  { lat: 48.8566, lng: 2.3522, name: 'Eiffel Tower, Paris' },
  { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
  { lat: 41.3851, lng: 2.1734, name: 'Barcelona' },
  { lat: 52.5200, lng: 13.4050, name: 'Berlin' },
  { lat: -33.8688, lng: 151.2093, name: 'Sydney Opera House' },
  { lat: 41.9028, lng: 12.4964, name: 'Rome' },
  { lat: 52.3676, lng: 4.9041, name: 'Amsterdam' }
];

function Game({ location, onEndRound, roundNumber, maxRounds }) {
  const [hasGuessed, setHasGuessed] = useState(false);
  const [guessLocation, setGuessLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [score, setScore] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const streetViewRef = useRef(null);
  const usedLocationsRef = useRef([]);

  // Initialize with a verified location
  useEffect(() => {
    if (!currentLocation) {
      // Get a random verified location that hasn't been used yet
      let availableLocations = VERIFIED_LOCATIONS.filter(
        loc => !usedLocationsRef.current.some(used => 
          used.lat === loc.lat && used.lng === loc.lng
        )
      );
      
      // If all locations have been used, reset the used locations list
      if (availableLocations.length === 0) {
        usedLocationsRef.current = [];
        availableLocations = VERIFIED_LOCATIONS;
      }
      
      const randomIndex = Math.floor(Math.random() * availableLocations.length);
      const randomLocation = availableLocations[randomIndex];
      
      // Add to used locations list
      usedLocationsRef.current.push(randomLocation);
      
      // Set the current location
      setCurrentLocation(randomLocation);
      debugLog("Using verified location:", randomLocation);
    }
  }, []);

  // Initialize Google Street View
  useEffect(() => {
    if (currentLocation && streetViewRef.current && !window.google) {
      // Load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initializeStreetView();
      };
      
      script.onerror = () => {
        setErrorMessage("Failed to load Google Maps. Please check your internet connection.");
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    }
  }, [currentLocation]);

  const initializeStreetView = () => {
    if (!currentLocation || !streetViewRef.current || !window.google) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const panorama = new window.google.maps.StreetViewPanorama(
        streetViewRef.current,
        {
          position: { lat: currentLocation.lat, lng: currentLocation.lng },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
          addressControl: false,
          showRoadLabels: false,
          zoomControl: false,
          panControl: false,
          fullscreenControl: false,
          motionTracking: false,
          motionTrackingControl: false
        }
      );

      // Add event listeners
      panorama.addListener('status_changed', () => {
        if (panorama.getStatus() === 'OK') {
          setIsLoading(false);
        } else {
          setErrorMessage("Street view not available at this location. Trying another location...");
          setTimeout(() => useAnotherLocation(), 1000);
        }
      });

      // Store panorama reference
      streetViewRef.current = panorama;
    } catch (error) {
      console.error("Error initializing Street View:", error);
      setErrorMessage("Failed to initialize street view. Trying another location...");
      setIsLoading(false);
      setTimeout(() => useAnotherLocation(), 1000);
    }
  };

  const useAnotherLocation = () => {
    // Get a different verified location
    let availableLocations = VERIFIED_LOCATIONS.filter(
      loc => !usedLocationsRef.current.some(used => 
        used.lat === loc.lat && used.lng === loc.lng
      )
    );
    
    // If all other locations have been used, reset but exclude the current one
    if (availableLocations.length === 0) {
      usedLocationsRef.current = [currentLocation];
      availableLocations = VERIFIED_LOCATIONS.filter(
        loc => loc.lat !== currentLocation.lat || loc.lng !== currentLocation.lng
      );
    }
    
    // Select a random location
    const randomLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)];
    console.log("Using another verified location:", randomLocation);
    
    // Add to used locations list
    usedLocationsRef.current.push(randomLocation);
    
    // Reset state
    setCurrentLocation(randomLocation);
    setIsLoading(true);
    setErrorMessage(null);
  };

  // Handle map click for guessing
  const handleMapClick = (e) => {
    if (!hasGuessed) {
      setGuessLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    }
  };

  // Submit a guess
  const handleGuessSubmit = () => {
    if (guessLocation) {
      // Calculate distance between guess and actual location
      const actualLatLng = L.latLng(location.lat, location.lng);
      const guessLatLng = L.latLng(guessLocation.lat, guessLocation.lng);
      const distanceInMeters = actualLatLng.distanceTo(guessLatLng);
      const distanceInKm = distanceInMeters / 1000;
      
      setDistance(distanceInKm);
      
      // Calculate score - max 5000 points, decreasing with distance
      const calculatedScore = Math.max(
        0,
        Math.round(5000 * Math.exp(-distanceInKm / 2000))
      );
      
      setScore(calculatedScore);
      setHasGuessed(true);
    }
  };

  // Proceed to next round
  const handleNextRound = () => {
    onEndRound(score);
    setHasGuessed(false);
    setGuessLocation(null);
    setDistance(null);
    setScore(0);
    setErrorMessage(null);
    
    // Clean up the current viewer
    if (streetViewRef.current) {
      try {
        streetViewRef.current = null;
      } catch (error) {
        console.error("Error removing Google Street View:", error);
      }
    }
    
    setCurrentLocation(null);
    setIsLoading(true);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Round {roundNumber} of {maxRounds}</h2>
      </div>
      
      <div className="map-container">
        {isLoading ? (
          <div className="loading">
            {errorMessage || "Loading street view..."}
            <p className="loading-note">
              If loading takes too long, try refreshing the page or restarting with a different port.
            </p>
            <button onClick={useAnotherLocation} className="retry-btn">
              Try Another Location
            </button>
          </div>
        ) : (
          <div ref={streetViewRef} className="street-view"></div>
        )}
        
        {!hasGuessed && (
          <div className="guess-map">
            <MapContainer 
              center={[20, 0]} 
              zoom={2} 
              style={{ height: '100%', width: '100%' }}
            >
              <MapEvents onClick={handleMapClick} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {guessLocation && (
                <Marker position={[guessLocation.lat, guessLocation.lng]}>
                  <Popup>Your guess</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        )}
        
        {hasGuessed && (
          <div className="results-container">
            <h3>Round Result</h3>
            <p>Distance: {distance.toFixed(2)} km</p>
            <p>Score: {score} points</p>
            
            <div className="results-map">
              <MapContainer 
                center={[
                  (location.lat + guessLocation.lat) / 2,
                  (location.lng + guessLocation.lng) / 2
                ]}
                zoom={2} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.lat, location.lng]}>
                  <Popup>Actual location</Popup>
                </Marker>
                <Marker position={[guessLocation.lat, guessLocation.lng]}>
                  <Popup>Your guess</Popup>
                </Marker>
              </MapContainer>
            </div>
            
            <button className="next-btn" onClick={handleNextRound}>
              {roundNumber === maxRounds ? "See Final Results" : "Next Round"}
            </button>
          </div>
        )}
      </div>
      
      <div className="game-footer">
        <div className="score-display">
          Score: {score}
        </div>
        <button 
          className="guess-btn" 
          disabled={!guessLocation || hasGuessed} 
          onClick={handleGuessSubmit}
        >
          Make Guess
        </button>
      </div>
    </div>
  );
}

export default Game; 