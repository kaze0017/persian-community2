'use client';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';

type Props = {
  coordinates: {
    lat: number;
    lng: number;
  };
  height?: string;
  zoom?: number;
};

const libraries: Libraries = [];

const MapDisplay = ({ coordinates, height = '400px', zoom = 15 }: Props) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  if (loadError) return <div>Failed to load map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className='w-full rounded-xl overflow-hidden' style={{ height }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={coordinates}
        zoom={zoom}
        options={{
          mapTypeId: 'roadmap',
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          draggable: true,
          disableDefaultUI: true,
        }}
      >
        <Marker position={coordinates} />
      </GoogleMap>
    </div>
  );
};

export default MapDisplay;
