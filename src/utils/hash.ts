import { createHash } from 'crypto';

const salt = process.env.IP_HASH_SALT;

if (!salt) {
  throw new Error('IP_HASH_SALT não está definido no arquivo .env!');
}

export function creatIpHash(ip: string): string {
  return createHash('sha256')
    .update(ip + salt)
    .digest('hex');
}
