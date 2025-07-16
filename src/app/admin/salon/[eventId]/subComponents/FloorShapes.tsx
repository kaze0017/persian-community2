import React from 'react';
import { Rect, Circle, Line } from 'react-konva';
import type { Shape } from '../types';

interface FloorShapesProps {
  floor: Shape[];
}

export default function FloorShapes({ floor }: FloorShapesProps) {
  return (
    <>
      {floor.map((shape) => {
        switch (shape.type) {
          case 'rect':
            return (
              <Rect
                key={shape.id}
                id={shape.id}
                x={shape.x}
                y={shape.y}
                width={shape.width ?? 0}
                height={shape.height ?? 0}
                fill='#e5e7eb'
              />
            );
          case 'circle':
            return (
              <Circle
                key={shape.id}
                id={shape.id}
                x={shape.x}
                y={shape.y}
                radius={shape.radius ?? 0}
                fill='#e5e7eb'
              />
            );
          case 'triangle':
            return (
              <Line
                key={shape.id}
                id={shape.id}
                x={shape.x}
                y={shape.y}
                points={shape.points ?? []}
                closed
                fill='#e5e7eb'
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
