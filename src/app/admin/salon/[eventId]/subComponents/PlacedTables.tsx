// components/PlacedTables.tsx
import React from 'react';
import { Group, Circle, Rect, Text } from 'react-konva';
import { Table } from '../types';
import {
  getRectSeatPositions,
  getCircleSeatPositions,
  getRowSeatPositions,
} from '../helpers';

interface PlacedTablesProps {
  tables: Table[];
  // selectedId: string | null;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
}

export default function PlacedTables({
  tables,
  // selectedId,
  onSelect,
  onDragEnd,
}: PlacedTablesProps) {
  const getSeats = (table: Table) => {
    if (table.shape === 'circle')
      return getCircleSeatPositions(table.radius ?? 50, table.seats);
    if (table.shape === 'row') return getRowSeatPositions(table.seats);
    return getRectSeatPositions(
      table.width ?? 0,
      table.height ?? 0,
      table.seats,
      table.shape
    );
  };

  return (
    <>
      {tables.map((table) => {
        const gap = -20;

        const numberX =
          table.shape === 'circle'
            ? table.x
            : table.shape === 'row'
            ? table.x - table.seats * 15 + gap
            : table.x + (table.width ?? 0) / 2;

        const numberY =
          table.shape === 'circle'
            ? table.y
            : table.shape === 'row'
            ? table.y - 6
            : table.y + (table.height ?? 0) / 2;

        const seatPositions = getSeats(table);
        // const isSelected = selectedId === table.id;

        return (
          <Group
            key={table.id}
            id={table.id}
            x={table.x}
            y={table.y}
            draggable
            onClick={() => onSelect(table.id)}
            onTap={() => onSelect(table.id)}
            onDragEnd={(e) => {
              const node = e.target;
              onDragEnd(table.id, node.x(), node.y());
            }}
          >
            {table.shape === 'circle' ? (
              <Circle radius={table.radius} fill='#60a5fa' />
            ) : (
              <Rect
                width={table.width}
                height={table.height}
                cornerRadius={8}
                fill='#60a5fa'
              />
            )}

            <Text
              text={`#${table.tableNumber}`}
              x={numberX - table.x}
              y={numberY - table.y}
              fontSize={16}
              fill='black'
              fontStyle='bold'
              align={table.shape === 'row' ? 'left' : 'center'}
              verticalAlign='middle'
              offsetX={
                table.shape === 'circle'
                  ? 0
                  : table.shape === 'row'
                  ? 0
                  : (table.width ?? 0) / 2
              }
              offsetY={table.shape === 'circle' ? 8 : (table.height ?? 0) / 2}
            />

            {seatPositions.map(({ x, y, seatRadius }, i) => (
              <Circle
                key={`seat-${i}`}
                x={x}
                y={y}
                radius={seatRadius}
                fill='#781a1a'
                stroke='white'
                strokeWidth={1}
              />
            ))}
          </Group>
        );
      })}
    </>
  );
}
