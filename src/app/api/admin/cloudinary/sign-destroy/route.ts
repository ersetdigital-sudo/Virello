import { requireAdmin } from '../../../../../lib/adminAuth';
import { cloudinarySignature } from '../../../../../lib/cloudinarySign';
import { json, readJson, unauthorized } from '../../../_lib/http';

export async function POST(req: Request): Promise<Response> {
  try {
    if (!(await requireAdmin())) return unauthorized();

    const body = (await readJson(req)) ?? {};
    const publicId = typeof body.public_id === 'string' ? body.public_id : '';
    if (!publicId) return json({ error: 'public_id required' }, 400);

    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiKey || !apiSecret) throw new Error('Missing Cloudinary environment configuration');

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinarySignature({ public_id: publicId, timestamp }, apiSecret);

    return json({ api_key: apiKey, timestamp, signature });
  } catch (error) {
    console.error('POST /api/admin/cloudinary/sign-destroy failed:', error);
    return json({ error: 'internal' }, 500);
  }
}
