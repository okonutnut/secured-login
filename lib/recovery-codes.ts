'use server';

function generateRecoveryCode(): string {
  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

export async function generateRecoveryCodes(count = 10): Promise<string[]> {
  const codes = Array.from({ length: count }, () => generateRecoveryCode());
  return codes;
}
