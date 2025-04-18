'use client';
import { useEffect, useRef } from 'react';

export default function SphereMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api.sphere.gistda.or.th/map/?key=[test2022]';
    script.async = true;

    script.onload = () => {
      if (window.sphere && mapRef.current) {
        // Initialize map after script is loaded
        new window.sphere.Map({
          placeholder: mapRef.current,
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}
    />
  );
}
