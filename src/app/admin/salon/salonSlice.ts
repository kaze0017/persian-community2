// salonSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Table, Shape } from './[eventId]/types';

interface TableGroup {
  key: string;
  tables: Table[];
}

interface TablesState {
  tables: Table[];
  shapes: Shape[];
  availableGroups: TableGroup[];
  placedTables: Table[];
}

const initialState: TablesState = {
  tables: [],
  shapes: [],
  availableGroups: [],
  placedTables: [],
};

const makeGroupKey = (table: Table) => `${table.shape}-${table.seats}`;

const salonSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    addTables: (state, action: PayloadAction<Table[]>) => {
      state.tables.push(...action.payload);
    },
    removeTable: (state, action: PayloadAction<string>) => {
      state.tables = state.tables.filter((t) => t.id !== action.payload);
    },
    setTables: (state, action: PayloadAction<Table[]>) => {
      state.tables = action.payload;
    },

    addPlacedTables: (state, action: PayloadAction<Table[]>) => {
      state.placedTables.push(...action.payload);
    },
    updatePlacedTable: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Table> }>
    ) => {
      const idx = state.placedTables.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.placedTables[idx] = {
          ...state.placedTables[idx],
          ...action.payload.changes,
        };
      }
    },
    removePlacedTable: (state, action: PayloadAction<string>) => {
      state.placedTables = state.placedTables.filter((t) => t.id !== action.payload);
    },
    setPlacedTables: (state, action: PayloadAction<Table[]>) => {
      state.placedTables = action.payload;
    },

    setShapes: (state, action: PayloadAction<Shape[]>) => {
      state.shapes = action.payload;
    },
    addShape: (state, action: PayloadAction<Shape>) => {
      state.shapes.push(action.payload);
    },
    removeShape: (state, action: PayloadAction<string>) => {
      state.shapes = state.shapes.filter((s) => s.id !== action.payload);
    },
    undoLastShape: (state) => {
      state.shapes.pop();
    },

    // <-- This is the new reducer to update a shape by id
    updateShape: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Shape> }>
    ) => {
      const { id, changes } = action.payload;
      const index = state.shapes.findIndex((shape) => shape.id === id);
      if (index !== -1) {
        state.shapes[index] = {
          ...state.shapes[index],
          ...changes,
        };
      }
    },

    setAvailableGroups: (state, action: PayloadAction<TableGroup[]>) => {
      state.availableGroups = action.payload;
    },

    addTableToAvailableGroups: (state, action: PayloadAction<Table>) => {
      const table = action.payload;
      const key = makeGroupKey(table);
      const group = state.availableGroups.find((g) => g.key === key);
      if (group) {
        group.tables.push(table);
      } else {
        state.availableGroups.push({ key, tables: [table] });
      }
    },

    removeATableFromAvailableGroupsByKey: (
  state,
  action: PayloadAction<{ key: string; id: string }>
) => {
  const { key, id } = action.payload;

  console.log('🔄 Attempting to remove table from available groups');
  console.log('➡ Key:', key);
  console.log('➡ ID:', id);
  console.log('🔍 State before:', JSON.parse(JSON.stringify(state.availableGroups)));

  const group = state.availableGroups.find((g) => g.key === key);
  if (!group) {
    console.warn(`❌ Group not found for key: ${key}`);
    return;
  }

  const tableExists = group.tables.some((t) => t.id === id);
  if (!tableExists) {
    console.warn(`❌ Table with id ${id} not found in group ${key}`);
    return;
  }

  // Filter out the table from the group
  group.tables = group.tables.filter((t) => t.id !== id);

  // If no tables left, remove the group
  if (group.tables.length === 0) {
    state.availableGroups = state.availableGroups.filter((g) => g.key !== key);
  }

  console.log('✅ Updated availableGroups:', JSON.parse(JSON.stringify(state.availableGroups)));
}

  },
});

export const {
  addTables,
  removeTable,
  setTables,
  addPlacedTables,
  updatePlacedTable,
  removePlacedTable,
  setPlacedTables,
  setShapes,
  addShape,
  removeShape,
  undoLastShape,
  updateShape, // <-- don't forget to export here
  setAvailableGroups,
  addTableToAvailableGroups,
  removeATableFromAvailableGroupsByKey,
} = salonSlice.actions;

export default salonSlice.reducer;
