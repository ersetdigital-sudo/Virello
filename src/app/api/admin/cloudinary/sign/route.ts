import { requireAdmin } from '../../../../../lib/adminAuth';
import { cloudinarySignature } from '../../../../../lib/cloudinarySign';
import { json, unauthorized } from '../../../_lib/http';

export async function POST(): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !apiKey || !apiSecret || !uploadPreset) {
      throw new Error('Missing Cloudinary environment configuration');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'virello';
    const signature = cloudinarySignature(
      { folder, timestamp, upload_preset: uploadPreset },
      apiSecret
    );

    return json({
      cloud_name: cloudName,
      api_key: apiKey,
      upload_preset: uploadPreset,
      folder,
      timestamp,
      signature,
    });
  } catch (error) {
    console.error('POST /api/admin/cloudinary/sign failed:', error);
    return json({ error: 'internal' }, 500);
  }
}
