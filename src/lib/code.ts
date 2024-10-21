const CHAR_MAP = '0123456789abcdefghijklmnopqrstuvwxyz';

function generateReferralCode(userId: string): string {
  // 移除破折號並轉換為小寫
  const cleanId = userId.replace(/-/g, '').toLowerCase();
  
  let code = '';
  for (let i = 0; i < cleanId.length; i += 4) {
    const chunk = parseInt(cleanId.slice(i, i + 4), 16);
    code += CHAR_MAP[chunk % 36];
  }
  
  return code.padEnd(8, '0');
}

function decodeReferralCode(code: string): string {
  let decoded = '';
  for (let i = 0; i < code.length; i++) {
    const index = CHAR_MAP.indexOf(code[i]);
    decoded += index.toString(16).padStart(4, '0');
  }
  
  // 恢復 UUID 格式
  return `${decoded.slice(0, 8)}-${decoded.slice(8, 12)}-${decoded.slice(12, 16)}-${decoded.slice(16, 20)}-${decoded.slice(20, 32)}`;
}

export { generateReferralCode, decodeReferralCode };