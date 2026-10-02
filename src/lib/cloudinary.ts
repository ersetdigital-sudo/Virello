const UPLOAD_MARKER = '/image/upload/';

export function cldImg(url: string | null | undefined, opts?: { w?: number; h?: number }): string {
  if (!url) return '';
  const idx = url.indexOf(UPLOAD_MARKER);
  if (idx === -1) return url;
  const after = url.slice(idx + UPLOAD_MARKER.length);
  const nextSlash = after.indexOf('/');
  const firstSeg = nextSlash === -1 ? after : after.slice(0, nextSlash);
  if (firstSeg.includes(',')) return url;

  const transforms = ['f_auto', 'q_auto'];
  if (opts?.w) transforms.push(`w_${opts.w}`);
  if (opts?.h) transforms.push(`h_${opts.h}`);
  if (opts?.w || opts?.h) transforms.push('c_fill');
  return url.slice(0, idx + UPLOAD_MARKER.length) + transforms.join(',') + '/' + after;
}
