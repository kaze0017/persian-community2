export type PinImageFile = {
  tempSrc: string;
  file: File;
  caption?: string;
};

export type PinImagesData = {
  pinId: string;
  files: PinImageFile[];
};
