import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { bucket } from '../lib/firebase-admin'; // Assuming this correctly references admin.storage().bucket()
import sharp from 'sharp';
import path from 'path';
import { unlink } from 'fs/promises';

export const optimizeBusinessImages = onObjectFinalized({
  memory: '2GiB',      // Increased memory to 2GB for demanding image processing
  timeoutSeconds: 300  // Increased timeout to 5 minutes to handle larger files or burst uploads
}, async (event) => {
  const filePath = event.data.name;
  const contentType = event.data.contentType || '';
  const fileMetadata = event.data.metadata || {}; // Capture custom metadata

  // --- Crucial: Prevent Infinite Loops ---
  // If the file has our custom 'optimized' metadata flag, it means we created it, so skip it.
  if (fileMetadata.optimized === 'true') {
    console.log(`Skipping already optimized file (detected by metadata): ${filePath}`);
    return;
  }
  // Also keep your existing checks for already WEBP files as a secondary safeguard.
  if (contentType.startsWith('image/webp') &&
      (filePath.endsWith('.webp') || filePath.includes('_thumb.webp') || filePath.includes('_slide.webp'))) {
    console.log(`Skipping already optimized WEBP (detected by content type/filename): ${filePath}`);
    return;
  }
  // ----------------------------------------

  // 🔹 Skip invalid paths
  if (!filePath || !filePath.startsWith('businesses/')) {
    console.log(`Skipping invalid path: ${filePath}`);
    return;
  }

  // Note: For 'onObjectFinalized', the event.type is always 'google.cloud.storage.object.v1.finalized'.
  // The check for `event.type === 'google.cloud.storage.object.v1.deleted'` will never be true here.
  // If you need to handle deletes, you'd set up a separate `onObjectDeleted` function.
  if (event.type === 'google.cloud.storage.object.v1.deleted') {
    console.log(`File deleted: ${filePath} (This log indicates an unexpected event type for this trigger.)`);
    return;
  }

  // ✅ Skip non-image files
  if (!contentType.startsWith('image/')) {
    console.log(`Skipping non-image file: ${filePath}`);
    return;
  }

  const fileName = path.basename(filePath);
  // Use path.join for more robust temp file path creation
  const tempLocalPath = path.join('/tmp', fileName);
  const bucketFile = bucket.file(filePath);

  try {
    await bucketFile.download({ destination: tempLocalPath });
    console.log(`Downloaded ${filePath} to ${tempLocalPath}`);

    // Process directly from the downloaded temp file
    const buffer = await sharp(tempLocalPath).toBuffer();
    const purpose = getPurposeFromPath(filePath);

    const ext = path.extname(filePath);
    const basePath = filePath.replace(ext, '');

    // Define common options for uploading optimized files, including our custom metadata
    const uploadOptions = {
      contentType: 'image/webp',
      metadata: {
        optimized: 'true' // This custom metadata prevents re-triggering
      }
    };

    let optimizedBuffer: Buffer;

    switch (purpose) {
      case 'logo':
        optimizedBuffer = await sharp(buffer)
          .resize(200, 200, { fit: 'cover', background: { r: 255, g: 255, b: 255, alpha: 0 } })
          .webp({ quality: 90 })
          .toBuffer();
        await saveOptimized(filePath, optimizedBuffer, uploadOptions);
        break;

      case 'profile':
        optimizedBuffer = await sharp(buffer)
          .resize(300, 300, { fit: 'cover' })
          .webp({ quality: 85 })
          .toBuffer();
        await saveOptimized(filePath, optimizedBuffer, uploadOptions);
        break;

      case 'banner':
        optimizedBuffer = await sharp(buffer)
          .resize(1600, 400, { fit: 'cover' })
          .webp({ quality: 80 })
          .toBuffer();
        await saveOptimized(filePath, optimizedBuffer, uploadOptions);
        break;

      case 'card':
        optimizedBuffer = await sharp(buffer)
          .resize(600, 400, { fit: 'cover' })
          .webp({ quality: 80 })
          .toBuffer();
        await saveOptimized(filePath, optimizedBuffer, uploadOptions);
        break;

      case 'gallery': {
        const slideBuffer = await sharp(buffer)
          .resize(1920, null, { fit: 'inside' })
          .webp({ quality: 85 })
          .toBuffer();
          // Ensure metadata is passed for all saved files
          await saveOptimized(`${basePath}_slide.webp`, slideBuffer, uploadOptions);

        const thumbnailBuffer = await sharp(buffer)
          .resize(400, null, { fit: 'inside' })
          .webp({ quality: 60 })
          .toBuffer();
          await saveOptimized(`${basePath}_thumb.webp`, thumbnailBuffer, uploadOptions);
        break;
      }

      case 'services':
      case 'clients': 
      case 'rewards': {
        const thumbnailBuffer = await sharp(buffer)
          .resize(400, null, { fit: 'inside' })
          .webp({ quality: 70 })
          .toBuffer();

        // Direct bucket.file.save call, needs to use the uploadOptions too
        await bucket.file(`${basePath}_thumb.webp`).save(thumbnailBuffer, uploadOptions);
        console.log(`Thumbnail saved: ${basePath}_thumb.webp`);
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

// Modified saveOptimized function to accept and apply upload options
function saveOptimized(filePath: string, buffer: Buffer, options: { contentType: string, metadata: { [key: string]: string } }) {
  const optimizedFilePath = filePath.replace(path.extname(filePath), '.webp');
  // Pass the entire options object directly to .save()
  return bucket.file(optimizedFilePath).save(buffer, options);
}

function getPurposeFromPath(filePath: string): 'logo' | 'profile' | 'banner' | 'card' | 'gallery' | 'services' | 'rewards' | 'clients' | 'unknown' {
  // Your logic to determine purpose based on naming convention
  if (filePath.includes('logo')) return 'logo';
  if (filePath.includes('owner')) return 'profile'; // Assuming 'owner' implies a profile image
  if (filePath.includes('banner')) return 'banner';
  if (filePath.includes('card')) return 'card';
  if (filePath.includes('gallery')) return 'gallery';
  if (filePath.includes('services')) return 'services';
  if (filePath.includes('rewards')) return 'rewards';
  if (filePath.includes('clients')) return 'clients';
  return 'unknown';
}
