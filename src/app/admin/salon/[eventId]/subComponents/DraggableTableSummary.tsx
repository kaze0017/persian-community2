import React, { FC } from 'react';
import { Table } from '../types';
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableGroup {
  tables: Table[];
}

interface DraggableTableSummaryProps {
  availableGroups: TableGroup[];
  onDragStart: (table: Table) => void;
  onDragEnd: () => void;
}

const ShapePreview: FC<{ shape: string; seats: number }> = ({
  shape,
  seats,
}) => {
  // circle preview or rect preview
  const size = 24;
  const seatText = seats.toString();

  if (shape === 'circle') {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#3b82f6', // Tailwind blue-500
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          userSelect: 'none',
        }}
      >
        {seatText}
      </div>
    );
  }

  // For rect or square shape preview
  return (
    <div
      style={{
        width: size,
        height: size * 0.6,
        borderRadius: 4,
        backgroundColor: '#3b82f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        userSelect: 'none',
      }}
    >
      {seatText}
    </div>
  );
};

const DraggableTableSummary: FC<DraggableTableSummaryProps> = ({
  availableGroups = [],
  onDragStart,
  onDragEnd,
}) => {
  return (
    <div className='mb-6'>
      <h3 className='text-lg font-semibold mb-4'>Drag Tables to Canvas</h3>

      {availableGroups.length === 0 ? (
        <p className='text-muted-foreground'>No tables available.</p>
      ) : (
        <ShadTable className='w-full'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-16'>Preview</TableHead>
              <TableHead>Shape</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className='text-center'>Count</TableHead>
              <TableHead className='text-center'>Drag</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableGroups.map(({ tables }) => {
              if (!tables.length) return null;
              const firstTable = tables[0];
              const { shape, seats, id } = firstTable;
              const key = `${shape}-${seats}`;

              return (
                <TableRow
                  key={key}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      'application/my-table',
                      JSON.stringify(firstTable)
                    );
                    onDragStart(firstTable);
                  }}
                  onDragEnd={onDragEnd}
                  className='cursor-grab hover:bg-muted'
                >
                  <TableCell className='w-16'>
                    <ShapePreview shape={shape} seats={seats} />
                  </TableCell>
                  <TableCell className='capitalize'>{shape}</TableCell>
                  <TableCell>{`${shape} table for ${seats} seats`}</TableCell>
                  <TableCell className='text-center font-medium'>
                    {tables.length}
                  </TableCell>
                  <TableCell className='text-center select-none'>⇅</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </ShadTable>
      )}
    </div>
  );
};

export default DraggableTableSummary;
