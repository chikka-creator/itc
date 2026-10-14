import crypto from 'crypto';

export function cuid(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = crypto.randomBytes(8).toString('hex');
  return `c${timestamp}${randomPart}`.slice(0, 24);
}
