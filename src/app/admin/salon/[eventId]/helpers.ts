export type TableShape = 'rect' | 'square' | 'circle' | 'row'; 

const  getRectSeatPositions = ( width: number,
  height: number,
  seats: number,
  shape: TableShape) => {
  const seatRadius = 8;
  const positions: { x: number; y: number; seatRadius: number }[] = [];

  if (shape === 'square') {
    // ...existing square seat positioning logic...
    const sides = ['top', 'right', 'bottom', 'left'];
    let seatIndex = 0;
    const maxPerSide = Math.ceil(seats / 4);
    let sideCounts = [0, 0, 0, 0];

    while (seatIndex < seats) {
      for (let s = 0; s < 4 && seatIndex < seats; s++) {
        if (sideCounts[s] < maxPerSide) {
          sideCounts[s]++;
          seatIndex++;
        }
      }
    }

    sides.forEach((side, i) => {
      const count = sideCounts[i];
      for (let j = 0; j < count; j++) {
        const gapX = width / (count + 1);
        const gapY = height / (count + 1);
        switch (side) {
          case 'top':
            positions.push({
              x: gapX * (j + 1),
              y: -seatRadius * 2,
              seatRadius,
            });
            break;
          case 'right':
            positions.push({
              x: width + seatRadius * 2,
              y: gapY * (j + 1),
              seatRadius,
            });
            break;
          case 'bottom':
            positions.push({
              x: gapX * (j + 1),
              y: height + seatRadius * 2,
              seatRadius,
            });
            break;
          case 'left':
            positions.push({
              x: -seatRadius * 2,
              y: gapY * (j + 1),
              seatRadius,
            });
            break;
        }
      }
    });
  } else {
    // For 'rect' and default shapes: seats on top and bottom
    const half = Math.floor(seats / 2);
    const gap = width / (half + 1);
    for (let i = 1; i <= half; i++) {
      positions.push({ x: gap * i, y: -seatRadius * 2, seatRadius });
    }
    for (let i = 1; i <= seats - half; i++) {
      positions.push({ x: gap * i, y: height + seatRadius * 2, seatRadius });
    }
  }

  return positions;
}

const  getCircleSeatPositions = (radius: number, seats: number) => {
  const angleStep = (2 * Math.PI) / seats;
  return Array.from({ length: seats }, (_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
      seatRadius: 8,
    };
  });
}


// New function for row seats (no table shape)
const  getRowSeatPositions = (seats: number) => {
   const seatSpacing = 30;
  const totalWidth = (seats - 1) * seatSpacing;
  const startX = -totalWidth / 2;

  return Array.from({ length: seats }, (_, i) => ({
    x: startX + i * seatSpacing,
    y: 0,
    seatRadius: 8,
  }));
}

export { getRectSeatPositions, getCircleSeatPositions, getRowSeatPositions };
