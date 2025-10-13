'use client';
import React, { useCallback, useRef, useState, useMemo } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Marker,
} from '@react-google-maps/api';
import { v4 as uuidv4 } from 'uuid';
import { LatLng, MarkerData, HikeMapData } from '@/types/event';
import Toolbar from './Toolbar';
import TiptapEditor from './TiptapEditor';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { uploadImage } from '@/services/storageService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const libraries: ('drawing' | 'geometry' | 'places')[] = [
  'drawing',
  'geometry',
  'places',
];

interface Action {
  type: 'ADD_PATH_POINT' | 'ADD_PIN';
  payload: {
    pathPoint?: LatLng;
    marker?: MarkerData;
  };
}

interface HikeMapProps {
  eventId: string;
}

export default function HikeMap({ eventId }: HikeMapProps) {
  // const images = useSelector((state: any) => state.pinImages.images);
  const clientId = useSelector((state: any) => state.user?.uid || ''); // Assuming user state has uid
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [path, setPath] = useState<LatLng[]>([]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const [tool, setTool] = useState<'draw' | 'pin' | null>(null);
  const [history, setHistory] = useState<Action[]>([]);
  const [future, setFuture] = useState<Action[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [images, setImages] = useState<{ file: File; tempSrc: string }[]>([]);

  const handleSaveAll = useCallback(async () => {
    const data: HikeMapData = {
      eventId,
      path,
      markers,
    };
    console.log('***Uploading images for event:', data);
    await Promise.all(
      images.map(async (img: any) => {
        console.log('img to upload:', img);
        const url = await uploadImage(
          img.file,
          `clients/${clientId}/events/${eventId}/pins`,
          img.file.name
        );
        data.markers?.forEach((marker) => {
          if (marker.description && marker.description.includes(img.tempSrc)) {
            marker.description = marker.description
              .split(img.tempSrc)
              .join(url);
          }
        });
        console.log('***Uploaded image URL:', url);
      })
    );
    console.log('Saving data:', data);
    try {
      const docRef = doc(db, 'users', clientId, 'events', eventId); // event document
      await setDoc(
        docRef,
        { hikeMap: data }, // store data under the hikeMap field
        { merge: true } // preserve other fields in the document
      );
      console.log('✅ Hike map saved successfully!');
    } catch (error) {
      console.error('❌ Failed to save hike map:', error);
    }
  }, [eventId, path, markers]);

  const handleCancel = useCallback(() => {
    setPath([]);
    setMarkers([]);
    setHistory([]);
    setFuture([]);
    setSelectedMarker(null);
    setOpenInfo(null);
    setTool(null);
  }, []);

  const handleUploadMedia = useCallback((markerId: string, files: File[]) => {
    const readers = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((imageUrls) => {
      setMarkers((prev) =>
        prev.map((m) =>
          m.id === markerId
            ? { ...m, imageUrls: [...m.imageUrls, ...imageUrls] }
            : m
        )
      );
    });
  }, []);

  const handleUpdateMarker = useCallback(
    (markerId: string, updates: Partial<MarkerData>) => {
      setMarkers((prev) =>
        prev.map((m) => (m.id === markerId ? { ...m, ...updates } : m))
      );
      if (selectedMarker && selectedMarker.id === markerId) {
        setSelectedMarker((prev) => (prev ? { ...prev, ...updates } : prev));
      }
    },
    [selectedMarker]
  );

  const togglePin = useCallback((markerId: string) => {
    setMarkers((prev) =>
      prev.map((m) => (m.id === markerId ? { ...m, isPinned: !m.isPinned } : m))
    );
  }, []);

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng || !tool) return;

      event.stop();

      const newPosition: LatLng = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      if (tool === 'draw') {
        const action: Action = {
          type: 'ADD_PATH_POINT',
          payload: { pathPoint: newPosition },
        };
        setPath((prev) => [...prev, newPosition]);
        setMarkers((prev) => [
          ...prev,
          {
            id: uuidv4(),
            eventId,
            position: newPosition,
            title: '',
            description: '',
            imageUrls: [],
            isPinned: false,
          },
        ]);
        setHistory((prev) => [...prev, action]);
        setFuture([]);
      } else if (tool === 'pin') {
        const newMarker: MarkerData = {
          id: uuidv4(),
          eventId,
          position: newPosition,
          title: `Point ${markers.length + 1}`,
          description: '',
          imageUrls: [],
          isPinned: true,
        };
        const action: Action = {
          type: 'ADD_PIN',
          payload: { marker: newMarker },
        };
        setMarkers((prev) => [...prev, newMarker]);
        setHistory((prev) => [...prev, action]);
        setFuture([]);
      }
    },
    [tool, markers.length]
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;

    const lastAction = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [...prev, lastAction]);

    if (lastAction.type === 'ADD_PATH_POINT') {
      setPath((prev) => prev.slice(0, -1));
      setMarkers((prev) =>
        prev.filter((m) => m.position !== lastAction.payload.pathPoint)
      );
    } else if (lastAction.type === 'ADD_PIN') {
      setMarkers((prev) =>
        prev.filter((m) => m.id !== lastAction.payload.marker!.id)
      );
    }
    setSelectedMarker(null);
    setOpenInfo(null);
  }, [history]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;

    const nextAction = future[future.length - 1];
    setFuture((prev) => prev.slice(0, -1));
    setHistory((prev) => [...prev, nextAction]);

    if (nextAction.type === 'ADD_PATH_POINT') {
      setPath((prev) => [...prev, nextAction.payload.pathPoint!]);
      setMarkers((prev) => [
        ...prev,
        {
          id: uuidv4(),
          eventId,
          position: nextAction.payload.pathPoint!,
          title: '',
          description: '',
          imageUrls: [],
          isPinned: false,
        },
      ]);
    } else if (nextAction.type === 'ADD_PIN') {
      setMarkers((prev) => [...prev, nextAction.payload.marker!]);
    }
  }, [future]);

  const mapRef = useRef<google.maps.Map | null>(null);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.setOptions({ disableDoubleClickZoom: true });
  }, []);

  const memoizedMarkers = useMemo(() => {
    return markers
      .filter((m) => m.isPinned)
      .map((m) => {
        const pos = m.position;
        if (!pos?.lat || !pos?.lng) {
          // fallback position if lat/lng are missing
          return null;
        }
        return (
          <Marker
            key={m.id}
            position={{ lat: pos.lat, lng: pos.lng }}
            onClick={() => {
              setSelectedMarker(m);
              setOpenInfo(m.id);
            }}
          />
        );
      })
      .filter(Boolean); // remove nulls
  }, [markers]);

  if (loadError) return <div className='text-red-500'>Error loading map</div>;
  if (!isLoaded) return <div className='text-gray-500'>Loading map...</div>;

  return (
    <div className='w-full  relative flex flex-col gap-4'>
      <Toolbar
        setTool={setTool}
        activeTool={tool}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        onSave={handleSaveAll}
        onCancel={handleCancel}
      />
      <div className='w-full h-[600px]'>
        <GoogleMap
          onLoad={onMapLoad}
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={{ lat: 46.495, lng: -80.986 }}
          zoom={14}
          onClick={handleMapClick}
          options={{ disableDoubleClickZoom: true }}
        >
          <Polyline
            path={path.map((p) => ({ lat: p.lat!, lng: p.lng! }))}
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
        <DialogContent className='!p-2 !m-0 !w-[90%] !max-w-[1280px] !h-[80vh] overflow-auto absolute inset-0 mx-auto z-[1000] !top-[50vh] !left-[50vw]'>
          {selectedMarker && (
            <TiptapEditor
              eventId={eventId}
              pinId={selectedMarker.id}
              marker={selectedMarker}
              handleUpdateMarker={handleUpdateMarker}
              setImages={setImages}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
