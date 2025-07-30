import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { bucket } from '../lib/firebase-admin';
import sharp from 'sharp';
import path from 'path';
import { unlink } from 'fs/promises';

export const optimizeEventsImages = onObjectFinalized({
  memory: '2GiB',
  timeoutSeconds: 300
}, async (event) => {
  const filePath = event.data.name;
  const contentType = event.data.contentType || '';
  const fileMetadata = event.data.metadata || {};

  if (fileMetadata.optimized === 'true') return;
  if (contentType.startsWith('image/webp')) return;

  if (!filePath || !filePath.startsWith('events/')) {
    console.log(`Skipping invalid path: ${filePath}`);
    return;
  }

  if (!contentType.startsWith('image/')) return;

  const fileName = path.basename(filePath);
  const tempLocalPath = path.join('/tmp', `${Date.now()}_${fileName}`);
  const bucketFile = bucket.file(filePath);

  try {
    await bucketFile.download({ destination: tempLocalPath });
    console.log(`Downloaded ${filePath} to ${tempLocalPath}`);

    const purpose = getPurposeFromPath(filePath);
    const ext = path.extname(filePath);
    const basePath = filePath.replace(ext, '');

    const baseBuffer = await sharp(tempLocalPath)
      .resize({ width: 2000, withoutEnlargement: true })
      .toBuffer();

    const uploadOptions = {
      contentType: 'image/webp',
      metadata: {
        optimized: 'true'
      }
    };

    switch (purpose) {
      case 'banner': {
        const sizes = [
          { suffix: 'small', width: 480 },
          { suffix: 'medium', width: 768 },
          { suffix: 'large', width: 1080 },
          { suffix: 'xlarge', width: 1440 },
        ];

        for (const { suffix, width } of sizes) {
          const optimizedBuffer = await sharp(baseBuffer)
            .resize(width, null, { fit: 'inside' })
            .webp({ quality: 80 })
            .toBuffer();

          await saveOptimized(`${basePath}_${suffix}.webp`, optimizedBuffer, uploadOptions);
        }

        break;
      }

      default:
        console.log(`Skipping unknown purpose: ${filePath}`);
        return;
    }

    console.log(`Optimization completed for: ${filePath}`);
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error);
 } finally {
    try {
      // Always ensure the temporary file is deleted to free up disk space
      await unlink(tempLocalPath);
      console.log(`Cleaned up temp file: ${tempLocalPath}`);
    } catch (cleanupError) {
      console.error(`Error cleaning up temp file ${tempLocalPath}:`, cleanupError);
    }
  }
});

function saveOptimized(filePath: string, buffer: Buffer, options: { contentType: string, metadata: { [key: string]: string } }) {
  return bucket.file(filePath).save(buffer, {
    contentType: options.contentType,
    metadata: options.metadata // Corrected: Pass the metadata object directly here
  });
}


function getPurposeFromPath(filePath: string): 'banner' | 'unknown' {
  if (filePath.includes('banner')) return 'banner';
  return 'unknown';
}
