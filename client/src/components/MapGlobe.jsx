import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapGlobe = ({ className = '' }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Read the token from Vite env (must be defined in .env as VITE_MAPBOX_TOKEN)
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (!token) {
    throw new Error(
      'No Mapbox token found. Please define VITE_MAPBOX_TOKEN in your .env file.'
    );
  }
  mapboxgl.accessToken = token;

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10', // Lighter map style for better contrast
      projection: 'globe',
      zoom: 2.5, // Increased zoom to make the globe visible
      center: [30, 15],
      pitch: 30, // Adjust pitch slightly for better view
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    // Disable scroll zoom for smoother experience
    map.current.scrollZoom.disable();

    // Adjust atmosphere and lighting effects on style load
    map.current.on('style.load', () => {
      map.current.setFog({
        color: 'rgb(10, 10, 20)', // Dark fog color for contrast
        'high-color': 'rgb(30, 40, 60)', // Lighter high-color for visibility
        'horizon-blend': 0.3, // Smoother horizon transition
      });
      map.current.setLight({
        color: '#ffffff',
        intensity: 0.6, // Increase light intensity for better visibility
      });
    });

    // Spin animation settings
    const secondsPerRevolution = 180;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      if (!map.current) return;
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let degreesPerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomFactor = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          degreesPerSecond *= zoomFactor;
        }
        const center = map.current.getCenter();
        center.lng -= degreesPerSecond;
        map.current.easeTo({
          center,
          duration: 1000,
          easing: (n) => n,
        });
      }
    }

    // User interaction events
    ['mousedown', 'dragstart'].forEach(evt =>
      map.current.on(evt, () => { userInteracting = true; })
    );
    ['mouseup', 'touchend'].forEach(evt =>
      map.current.on(evt, () => {
        userInteracting = false;
        spinGlobe();
      })
    );
    map.current.on('moveend', spinGlobe);

    // Kick off the spin
    spinGlobe();

    // Clean up
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div
        ref={mapContainer}
        className="absolute inset-0 rounded-lg shadow-lg"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/90 rounded-lg" />
    </div>
  );
};

export default MapGlobe;
