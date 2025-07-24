import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { bucket } from '../lib/firebase-admin';
import sharp from 'sharp';



export const optimizeProfileImage = onObjectFinalized(async (event) => {
  const object = event.data;
  if (!object) return;

  const filePath = object.name;
  if (!filePath) return;

  if (!filePath.startsWith('events/')) return;

  const fileName = filePath.split('/').pop();
  if (!fileName) return;

  if (fileName.endsWith('.webp')) return;

  const tempFilePath = `/tmp/${fileName}`;
  const optimizedFileName = fileName.replace(/\.\w+$/, '.webp');
  const optimizedFilePath = filePath.replace(fileName, optimizedFileName);

  const file = bucket.file(filePath);
  await file.download({ destination: tempFilePath });

  await sharp(tempFilePath)
    .resize(1600, 400, {
      fit: 'cover',
    })
    .webp({ quality: 80 })
    .toFile(`/tmp/${optimizedFileName}`);

  await bucket.upload(`/tmp/${optimizedFileName}`, {
    destination: optimizedFilePath,
    metadata: {
      contentType: 'image/webp',
    },
  });

  // Optionally delete original:
  // await file.delete();

  return null;
});

