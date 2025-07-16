'use client';

import React from 'react';
import { Table, TableShape } from '../types';

interface TableSummaryProps {
  tables: Table[];
  onAdd: (shape: TableShape, seats: number) => void;
  onRemove: (shape: TableShape, seats: number) => void;
}

export default function TableSummary({
  tables,
  onAdd,
  onRemove,
}: TableSummaryProps) {
  const tableGroups = tables.reduce<
    Record<string, { count: number; shape: TableShape; seats: number }>
  >((acc, table) => {
    const key = `${table.shape}-${table.seats}`;
    if (!acc[key]) {
      acc[key] = { count: 0, shape: table.shape, seats: table.seats };
    }
    acc[key].count += 1;
    return acc;
  }, {});

  const totalSeats = tables.reduce((sum, t) => sum + t.seats, 0);

  return (
    <div>
      <h3 className='mb-2 font-semibold'>Added Tables</h3>
      {tables.length === 0 && <p>No tables added yet.</p>}

      {tables.length > 0 && (
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='border-b font-medium'>
              <th className='p-2'>Shape</th>
              <th className='p-2'>Description</th>
              <th className='p-2'>Count</th>
              <th className='p-2'></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tableGroups).map(
              ([key, { shape, seats, count }]) => (
                <tr key={key} className='border-b'>
                  <td className='p-2'>
                    {shape === 'rect' || shape === 'square' ? (
                      <svg
                        width={shape === 'rect' ? 30 : 20}
                        height={20}
                        role='img'
                        aria-label={`${shape} table shape`}
                      >
                        <rect
                          width={shape === 'rect' ? 30 : 20}
                          height={20}
                          fill='#60a5fa'
                          rx={shape === 'rect' ? 3 : 0}
                        />
                      </svg>
                    ) : shape === 'row' ? (
                      // Simple row icon: several small seats in a row
                      <svg
                        width={40}
                        height={20}
                        role='img'
                        aria-label='row of seats'
                        viewBox='0 0 40 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        {[5, 15, 25, 35].map((cx) => (
                          <circle
                            key={cx}
                            cx={cx}
                            cy={10}
                            r={6}
                            fill='#60a5fa'
                          />
                        ))}
                      </svg>
                    ) : (
                      <svg
                        width={20}
                        height={20}
                        role='img'
                        aria-label='circle table shape'
                      >
                        <circle cx={10} cy={10} r={10} fill='#60a5fa' />
                      </svg>
                    )}
                  </td>
                  <td className='p-2'>
                    {shape === 'row'
                      ? `Row of ${seats} ${seats === 1 ? 'seat' : 'seats'}`
                      : `${
                          shape.charAt(0).toUpperCase() + shape.slice(1)
                        } table for ${seats} ${seats === 1 ? 'seat' : 'seats'}`}
                  </td>
                  <td className='p-2'>{count}</td>
                  <td className='p-2'>
                    <button
                      onClick={() => onAdd(shape, seats)}
                      className='px-2 text-green-600'
                      aria-label={`Add one more ${
                        shape === 'row' ? 'row of seats' : shape + ' table'
                      } with ${seats} ${seats === 1 ? 'seat' : 'seats'}`}
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemove(shape, seats)}
                      className='px-2 text-red-600'
                      aria-label={`Remove one ${
                        shape === 'row' ? 'row of seats' : shape + ' table'
                      } with ${seats} ${seats === 1 ? 'seat' : 'seats'}`}
                    >
                      -
                    </button>
                  </td>
                </tr>
              )
            )}

            <tr className='font-semibold'>
              <td className='p-2'>Total</td>
              <td className='p-2'>{tables.length} tables</td>
              <td className='p-2'>{totalSeats} seats</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
