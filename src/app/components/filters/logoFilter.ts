
  const color = '#06b6d4'; // Cyan color for the filter effect
  export const filter = `
    drop-shadow(0 0 10px ${color})
    brightness(0)
    saturate(100%)
    invert(60%)
    sepia(100%)
    hue-rotate(180deg)
  `;

    export const boxShadow = `
    inset -20px 20px 30px 0px #A5BBE432,
    inset -10px 10px 20px 0px #A5BBE426,
    inset -5px 5px 15px 0px #A5BBE408
  `;

  export const cardClass = `w-full h-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg`;
