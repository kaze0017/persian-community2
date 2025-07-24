import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { bucket } from '../lib/firebase-admin';
import sharp from 'sharp';
import path from 'path';

export const optimizeBusinessImages = onObjectFinalized({ timeoutSeconds: 60 }, async (event) => {
  const filePath = event.data.name;
  if (!filePath || !filePath.startsWith('businesses/')) return;

  const fileName = path.basename(filePath);
  const tempFilePath = `/tmp/${fileName}`;
  const bucketFile = bucket.file(filePath);

  try {
    // Download original image to /tmp
    await bucketFile.download({ destination: tempFilePath });

    const buffer = await sharp(tempFilePath).toBuffer();

    const purpose = getPurposeFromPath(filePath);

    // Apply resizing/compression rules based on purpose
    let optimizedBuffer: Buffer;

    switch (purpose) {
      case 'logo':
        optimizedBuffer = await sharp(buffer)
          .resize(200, 200, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
          .webp({ quality: 90 })
          .toBuffer();
        break;
      case 'profile':
        optimizedBuffer = await sharp(buffer)
          .resize(300, 300, { fit: 'cover' })
          .webp({ quality: 85 })
          .toBuffer();
        break;
      case 'banner':
        optimizedBuffer = await sharp(buffer)
          .resize(1600, 400, { fit: 'cover' })
          .webp({ quality: 80 })
          .toBuffer();
        break;
      case 'card':
        optimizedBuffer = await sharp(buffer)
          .resize(600, 400, { fit: 'cover' })
          .webp({ quality: 80 })
          .toBuffer();
        break;
      default:
        console.log(`Skipping unknown purpose: ${filePath}`);
        return;
    }

    const optimizedFilePath = filePath.replace(path.extname(filePath), '.webp');

    // Save optimized image
    await bucket.file(optimizedFilePath).save(optimizedBuffer, {
      contentType: 'image/webp',
    });
    console.log(`Optimized image saved to: ${optimizedFilePath}`);

    // Now safely delete the original file
    await new Promise((res) => setTimeout(res, 2000)); // 2 second delay

    // await bucketFile.delete();
    console.log(`Original file deleted: ${filePath}`);

  } catch (error) {
    console.error('Error optimizing image:', error);
    // Optional: Add retry logic or alert here
  }
});

function getPurposeFromPath(filePath: string): 'logo' | 'profile' | 'banner' | 'card' | 'unknown' {
  if (filePath.includes('logo')) return 'logo';
  if (filePath.includes('owner')) return 'profile';
  if (filePath.includes('banner')) return 'banner';
  if (filePath.includes('card')) return 'card';
  return 'unknown';
}
