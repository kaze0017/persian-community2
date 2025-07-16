'use client';
import type { Libraries } from '@react-google-maps/api';

import {
  useLoadScript,
  GoogleMap,
  Marker,
  Autocomplete,
} from '@react-google-maps/api';
import { useCallback, useRef, useState } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
};

const defaultCenter = {
  lat: 45.4211,
  lng: -75.6903,
};

const libraries: Libraries = ['places'];

type Props = {
  onChange: (
    coordinates: { lat: number; lng: number },
    address?: string
  ) => void;
};

export default function MapSelector({ onChange }: Props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const latLng = { lat, lng };

    setMarker(latLng);

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const address = results[0].formatted_address;
        if (inputRef.current) {
          inputRef.current.value = address;
        }
        onChange(latLng, address);
      } else {
        console.error('Geocoder failed due to:', status);
        onChange(latLng);
      }
    });
  };

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address || '';

    setMarker({ lat, lng });
    onChange({ lat, lng }, address);

    if (inputRef.current) {
      inputRef.current.value = address;
    }

    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15);
    }
  };

  if (loadError) return <div>Failed to load map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className='space-y-4'>
      <Autocomplete
        onLoad={(ref) => {
          autocompleteRef.current = ref;
        }}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          ref={inputRef}
          type='text'
          placeholder='Search for a place'
          className='w-full p-2 border border-gray-300 rounded-md'
        />
      </Autocomplete>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={marker || defaultCenter}
        zoom={marker ? 15 : 12}
        onLoad={onMapLoad}
        onClick={onMapClick}
        options={{
          mapTypeId: 'roadmap',
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        }}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </div>
  );
}
