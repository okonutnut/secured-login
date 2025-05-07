import bcrypt from 'bcryptjs';

export async function hashCode(code: string): Promise<string> {
  return await bcrypt.hash(code, 10);
}

export async function compareCode(code: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(code, hash);
}
