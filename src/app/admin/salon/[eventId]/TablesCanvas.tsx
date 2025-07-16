'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Group } from 'react-konva';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getCircleSeatPositions,
  getRowSeatPositions,
  getRectSeatPositions,
} from './helpers';
import { TableShape, Table } from './types';
import { v4 as uuidv4 } from 'uuid';
import { addTables as addTablesAction, removeTable } from '../salonSlice';
import TableSummary from './subComponents/TableSummery';

export default function TablesCanvas() {
  const dispatch = useAppDispatch();
  const tables = useAppSelector((state) => state.tables.tables);

  const [containerWidth, setContainerWidth] = useState(920);
  const containerRef = useRef<HTMLDivElement>(null);

  const [newShape, setNewShape] = useState<TableShape>('rect');
  const [newSeats, setNewSeats] = useState(4);
  const [newCount, setNewCount] = useState(1);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const canvasHeight = 320;
  const shapeWidth = 100;
  const shapeHeight = newShape === 'rect' ? 60 : 100;
  const centerX =
    newShape === 'circle' || newShape === 'row'
      ? containerWidth / 2
      : (containerWidth - shapeWidth) / 2;
  const centerY =
    newShape === 'circle' || newShape === 'row'
      ? canvasHeight / 2
      : (canvasHeight - shapeHeight) / 2;

  const createTable = (shape: TableShape, seats: number): Table => ({
    id: uuidv4(),
    shape,
    x: 100,
    y: 100,
    width: shape === 'rect' || shape === 'square' ? 100 : undefined,
    height: shape === 'rect' ? 60 : shape === 'square' ? 100 : undefined,
    radius: shape === 'circle' ? 50 : undefined,
    seats,
  });

  const addTables = () => {
    const newTablesArr: Table[] = Array.from({ length: newCount }, () =>
      createTable(newShape, newSeats)
    );
    dispatch(addTablesAction(newTablesArr));
  };

  const handleAddType = (shape: TableShape, seats: number) => {
    dispatch(addTablesAction([createTable(shape, seats)]));
  };

  const handleRemoveType = (shape: TableShape, seats: number) => {
    const tableToRemove = tables.find(
      (t) => t.shape === shape && t.seats === seats
    );
    if (tableToRemove) {
      dispatch(removeTable(tableToRemove.id));
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex gap-4 items-end'>
        <label className='flex flex-col space-y-1'>
          Table Shape:
          <Select
            value={newShape}
            onValueChange={(value) => setNewShape(value as TableShape)}
          >
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Select shape' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='rect'>Rectangle</SelectItem>
              <SelectItem value='square'>Square</SelectItem>
              <SelectItem value='circle'>Circle</SelectItem>
              <SelectItem value='row'>Row of Seats</SelectItem>
            </SelectContent>
          </Select>
        </label>

        <Label className='flex flex-col space-y-1 w-36'>
          Seats per Table:
          <Input
            type='number'
            min={1}
            max={20}
            value={newSeats}
            onChange={(e) => setNewSeats(parseInt(e.target.value) || 1)}
          />
        </Label>

        <Label className='flex flex-col space-y-1 w-36'>
          Number of Tables:
          <Input
            type='number'
            min={1}
            max={20}
            value={newCount}
            onChange={(e) => setNewCount(parseInt(e.target.value) || 1)}
          />
        </Label>

        <Button onClick={addTables} className='ml-4 h-10'>
          Add Tables
        </Button>
      </div>

      <div
        ref={containerRef}
        className='w-full border bg-gray-100 relative'
        style={{ height: canvasHeight }}
      >
        <h3 className='mb-2 font-semibold'>Preview Table with Seats</h3>
        <Stage width={containerWidth} height={canvasHeight}>
          <Layer>
            <Group x={centerX} y={centerY}>
              {newShape === 'circle' ? (
                <Circle x={0} y={0} radius={50} fill='#60a5fa' />
              ) : newShape === 'row' ? null : (
                <Rect
                  width={100}
                  height={shapeHeight}
                  fill='#60a5fa'
                  cornerRadius={8}
                />
              )}
              {(newShape === 'circle'
                ? getCircleSeatPositions(50, newSeats)
                : newShape === 'row'
                ? getRowSeatPositions(newSeats)
                : getRectSeatPositions(100, shapeHeight, newSeats, newShape)
              ).map(({ x, y, seatRadius }, i) => (
                <Circle
                  key={i}
                  x={x}
                  y={y}
                  radius={seatRadius}
                  fill='#f87171'
                />
              ))}
            </Group>
          </Layer>
        </Stage>
      </div>

      <TableSummary
        tables={tables}
        onAdd={handleAddType}
        onRemove={handleRemoveType}
      />
    </div>
  );
}
