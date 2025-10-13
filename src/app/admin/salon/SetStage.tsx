'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Transformer } from 'react-konva';
import Konva from 'konva';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  addPlacedTables,
  setAvailableGroups,
  removeATableFromAvailableGroupsByKey,
  updatePlacedTable,
} from './salonSlice';

import DraggableTableSummary from './subComponents/DraggableTableSummary';
import FloorShapes from './subComponents/FloorShapes';
import PlacedTables from './subComponents/PlacedTables';

import type { Table } from './types'; // Adjust path if needed

export default function PlaceTablesTab() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);

  const dispatch = useAppDispatch();
  const placedTables = useAppSelector((state) => state.tables.placedTables);
  const availableGroups = useAppSelector(
    (state) => state.tables.availableGroups
  );
  const tables = useAppSelector((state) => state.tables.tables);
  const floor = useAppSelector((state) => state.tables.shapes);

  // Properly type draggingTable state as Table or null
  const [draggingTable, setDraggingTable] = useState<Table | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Group tables effect with correct typing
  useEffect(() => {
    const groupsMap = new Map<string, { key: string; tables: Table[] }>();

    tables.forEach((table) => {
      if (placedTables.some((pt) => pt.id === table.id)) return;

      const key = `${table.shape}-${table.seats}`;
      const group = groupsMap.get(key);

      if (group) group.tables.push(table);
      else groupsMap.set(key, { key, tables: [table] });
    });

    dispatch(setAvailableGroups(Array.from(groupsMap.values())));
  }, [tables, placedTables, dispatch]);

  // Transformer logic
  useEffect(() => {
    if (!transformerRef.current) return;
    if (!selectedId || !stageRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }
    const node = stageRef.current.findOne(`#${selectedId}`);
    transformerRef.current.nodes(node ? [node] : []);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedId]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    let dragData: Table | null = draggingTable;

    if (!dragData) {
      const data = e.dataTransfer.getData('application/my-table');
      if (!data) return;

      try {
        dragData = JSON.parse(data) as Table;
      } catch {
        return;
      }
    }

    if (!dragData || !stageRef.current) return;

    const stage = stageRef.current;
    const stageRect = stage.container().getBoundingClientRect();

    const pointer = {
      x: e.clientX - stageRect.left,
      y: e.clientY - stageRect.top,
    };

    dispatch(
      removeATableFromAvailableGroupsByKey({
        key: `${dragData.shape}-${dragData.seats}`,
        id: dragData.id,
      })
    );

    dispatch(
      addPlacedTables([
        {
          ...dragData,
          id: dragData.id,
          x: pointer.x,
          y: pointer.y,
          scale: 1,
          tableNumber: placedTables.length + 1,
          width:
            dragData.shape === 'rect' || dragData.shape === 'square'
              ? 100
              : dragData.width,
          height:
            dragData.shape === 'rect'
              ? 60
              : dragData.shape === 'square'
                ? 100
                : dragData.height,
          radius: dragData.shape === 'circle' ? 50 : dragData.radius,
        },
      ])
    );

    setDraggingTable(null);
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    dispatch(updatePlacedTable({ id, changes: { x, y } }));
  };

  return (
    <div className='flex flex-col gap-4'>
      <DraggableTableSummary
        availableGroups={availableGroups}
        onDragStart={setDraggingTable}
        onDragEnd={() => setDraggingTable(null)}
      />

      <div
        className='flex-1 border relative'
        style={{ height: 600 }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Stage width={800} height={600} ref={stageRef} className='bg-gray-50'>
          <Layer>
            <FloorShapes floor={floor} />
            <PlacedTables
              tables={placedTables}
              // selectedId={selectedId}
              onSelect={setSelectedId}
              onDragEnd={handleDragEnd}
            />
            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
