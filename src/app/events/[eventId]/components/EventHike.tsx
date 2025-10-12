'use client';
import React, {
  useCallback,
  useRef,
  useState,
  useMemo,
  useEffect,
} from 'react';
import dynamic from 'next/dynamic';
import { useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';
import { LatLng, MarkerData, HikeMapData } from '@/types/event';
import TiptapEditor from '@/app/components/hikeMap/TiptapEditor';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const GoogleMap = dynamic(
  () => import('@react-google-maps/api').then((mod) => mod.GoogleMap),
  { ssr: false }
);

const libraries: ('drawing' | 'geometry' | 'places')[] = [
  'drawing',
  'geometry',
  'places',
];

interface EventHikeProps {
  hikeMap: HikeMapData;
}

export default function EventHike({ hikeMap }: EventHikeProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [path, setPath] = useState<LatLng[]>(hikeMap?.path || []);
  const [markers, setMarkers] = useState<MarkerData[]>(hikeMap?.markers || []);
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  const mapRef = useRef<any>(null);

  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map;
    if (typeof google !== 'undefined') {
      map.setOptions({
        disableDoubleClickZoom: true,
        gestureHandling: 'greedy',
      });
    }
  }, []);

  const memoizedMarkers = useMemo(() => {
    return markers
      .filter((m) => m.isPinned)
      .map((m) => (
        <Marker
          key={m.id}
          position={m.position}
          title={m.title}
          onClick={() => {
            setSelectedMarker(m);
            setOpenInfo(m.id);
          }}
        />
      ));
  }, [markers]);

  useEffect(() => {
    console.log(' **hikeMap: ', hikeMap);
    console.log(' **selectedMarker.description: ', selectedMarker?.description);
  }, [selectedMarker]);
  if (loadError) return <div className='text-red-500'>Error loading map</div>;
  if (!isLoaded) return <div className='text-gray-500'>Loading map...</div>;

  return (
    <div className='w-full relative flex flex-col gap-4'>
      <div className='w-full h-[600px]'>
        <GoogleMap
          onLoad={onMapLoad}
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={path.length > 0 ? path[0] : { lat: 46.495, lng: -80.986 }}
          zoom={14}
        >
          <Polyline
            path={path}
            options={{
              strokeWeight: 5,
              strokeColor: '#34a853',
              editable: false,
              clickable: false,
            }}
          />
          {memoizedMarkers}
        </GoogleMap>
      </div>

      <Dialog
        open={!!openInfo}
        onOpenChange={(open) => {
          if (!open) {
            setOpenInfo(null);
            setSelectedMarker(null);
          }
        }}
      >
        <DialogContent className='p-2 m-0 flex !w-[90vw] max-w-[1280px] h-[80vh] overflow-auto border'>
          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden>
                {selectedMarker?.title || 'Marker Description'}
              </VisuallyHidden>
            </DialogTitle>
            <DialogDescription>
              <VisuallyHidden>
                Read-only description of the selected marker
              </VisuallyHidden>
            </DialogDescription>
          </DialogHeader>
          {selectedMarker && (
            <div className='h-[70vh] overflow-auto w-full'>
              <TiptapEditor
                eventId={hikeMap.eventId}
                pinId={selectedMarker.id}
                marker={selectedMarker}
                handleUpdateMarker={() => {}}
                setImages={() => {}}
                editable={false}
                initialContent={
                  selectedMarker.description
                    ? JSON.parse(selectedMarker.description)
                    : { type: 'doc', content: [] }
                }
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
