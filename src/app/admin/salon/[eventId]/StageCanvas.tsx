'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { Shape as ShapeType } from './types';
import {
  addShape,
  undoLastShape,
  removeShape,
  updateShape, // <-- import updateShape here
} from '../salonSlice';
import Konva from 'konva';

type ToolType = 'rect' | 'circle' | 'triangle';

export default function StageCanvas() {
  const dispatch = useAppDispatch();
  const shapes = useAppSelector((state) => state.tables.shapes);

  const [selectedTool, setSelectedTool] = useState<ToolType>('rect');
  const [isDrawing, setIsDrawing] = useState(false);
  const [previewShape, setPreviewShape] = useState<ShapeType | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  const selectedShapeIdRef = useRef(selectedShapeId);
  selectedShapeIdRef.current = selectedShapeId;

  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        dispatch(undoLastShape());
        setSelectedShapeId(null);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedShapeIdRef.current) {
          dispatch(removeShape(selectedShapeIdRef.current));
          setSelectedShapeId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();

    if (clickedOnEmpty) {
      setSelectedShapeId(null);
      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (!pos) return;
      startPos.current = pos;
      setIsDrawing(true);
    } else {
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    const { x: startX, y: startY } = startPos.current;
    const width = pos.x - startX;
    const height = pos.y - startY;

    const shape: ShapeType = {
      id: 'preview',
      type: selectedTool,
      x: startX,
      y: startY,
      fill: '#60a5fa',
    };

    if (selectedTool === 'rect') {
      shape.width = width;
      shape.height = height;
    } else if (selectedTool === 'circle') {
      shape.radius = Math.sqrt(width ** 2 + height ** 2) / 2;
      shape.x = startX + width / 2;
      shape.y = startY + height / 2;
    } else if (selectedTool === 'triangle') {
      shape.points = [0, height, width / 2, 0, width, height];
    }

    setPreviewShape(shape);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !previewShape) return;
    const newShape = { ...previewShape, id: Date.now().toString() };
    dispatch(addShape(newShape));
    setPreviewShape(null);
    setIsDrawing(false);
  };

  const deleteSelectedShape = () => {
    if (!selectedShapeId) return;
    dispatch(removeShape(selectedShapeId));
    setSelectedShapeId(null);
  };

  return (
    <div className='border rounded-md p-4 bg-white space-y-4'>
      <div className='flex items-center gap-4'>
        <Tabs
          value={selectedTool}
          onValueChange={(value) => setSelectedTool(value as ToolType)}
          className='flex-1'
        >
          <TabsList className='flex'>
            <TabsTrigger value='rect' className='min-w-[80px] text-center'>
              Rectangle
            </TabsTrigger>
            <TabsTrigger value='circle' className='min-w-[80px] text-center'>
              Circle
            </TabsTrigger>
            <TabsTrigger value='triangle' className='min-w-[80px] text-center'>
              Triangle
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          variant='outline'
          onClick={() => {
            dispatch(undoLastShape());
            setSelectedShapeId(null);
          }}
          className='dark:bg-gray-800 dark:text-white hover:dark:bg-gray-700'
        >
          Undo (Ctrl+Z)
        </Button>

        <Button
          variant='outline'
          onClick={deleteSelectedShape}
          disabled={!selectedShapeId}
          className='dark:bg-gray-800 dark:text-white hover:dark:bg-gray-700'
        >
          Delete Selected
        </Button>
      </div>

      <Stage
        width={800}
        height={600}
        className='border shadow-md bg-gray-100'
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape) => {
            const isSelected = shape.id === selectedShapeId;
            if (shape.type === 'rect') {
              return (
                <Rect
                  key={shape.id}
                  id={shape.id}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill={shape.fill}
                  draggable
                  onClick={(e) => {
                    e.cancelBubble = true;
                    setSelectedShapeId(shape.id);
                  }}
                  stroke={isSelected ? 'blue' : undefined}
                  strokeWidth={isSelected ? 3 : 0}
                  onDragEnd={(e) => {
                    const node = e.target;
                    dispatch(
                      updateShape({
                        id: shape.id,
                        changes: { x: node.x(), y: node.y() },
                      })
                    );
                  }}
                />
              );
            }
            if (shape.type === 'circle') {
              return (
                <Circle
                  key={shape.id}
                  id={shape.id}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  fill={shape.fill}
                  draggable
                  onClick={(e) => {
                    e.cancelBubble = true;
                    setSelectedShapeId(shape.id);
                  }}
                  stroke={isSelected ? 'blue' : undefined}
                  strokeWidth={isSelected ? 3 : 0}
                  onDragEnd={(e) => {
                    const node = e.target;
                    dispatch(
                      updateShape({
                        id: shape.id,
                        changes: { x: node.x(), y: node.y() },
                      })
                    );
                  }}
                />
              );
            }
            if (shape.type === 'triangle') {
              return (
                <Line
                  key={shape.id}
                  id={shape.id}
                  x={shape.x}
                  y={shape.y}
                  points={shape.points || []}
                  closed
                  fill={shape.fill}
                  draggable
                  onClick={(e) => {
                    e.cancelBubble = true;
                    setSelectedShapeId(shape.id);
                  }}
                  stroke={isSelected ? 'blue' : undefined}
                  strokeWidth={isSelected ? 3 : 0}
                  onDragEnd={(e) => {
                    const node = e.target;
                    dispatch(
                      updateShape({
                        id: shape.id,
                        changes: { x: node.x(), y: node.y() },
                      })
                    );
                  }}
                />
              );
            }
            return null;
          })}

          {previewShape &&
            (previewShape.type === 'rect' ? (
              <Rect
                x={previewShape.x}
                y={previewShape.y}
                width={previewShape.width}
                height={previewShape.height}
                fill={previewShape.fill}
                opacity={0.5}
              />
            ) : previewShape.type === 'circle' ? (
              <Circle
                x={previewShape.x}
                y={previewShape.y}
                radius={previewShape.radius}
                fill={previewShape.fill}
                opacity={0.5}
              />
            ) : previewShape.type === 'triangle' ? (
              <Line
                x={previewShape.x}
                y={previewShape.y}
                points={previewShape.points || []}
                closed
                fill={previewShape.fill}
                opacity={0.5}
              />
            ) : null)}
        </Layer>
      </Stage>
    </div>
  );
}
