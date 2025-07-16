export type TableShape = 'rect' | 'square' | 'circle' | 'row';
export type ShapeType = 'rect' | 'circle' | 'triangle';


export type Table = {
  id: string;
  shape: TableShape;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  seats: number;
  scale?: number;
  tableNumber?: number;
}

export type Shape =  {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  fill: string;
}
