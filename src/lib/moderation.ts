const PHONE_PATTERN = /(\+?\d[\d\s-]{6,}\d)/;
const CONTACT_PHRASE_PATTERN = /\b(call me|whatsapp|telegram|wechat|text me|dm me|contact me)\b/i;
const EMAIL_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const URL_PATTERN = /\b(https?:\/\/|www\.)\S+/i;

export type ModerationResult = {
  flagged: boolean;
  reason?: string;
};

export function moderateText(text: string): ModerationResult {
  if (!text || !text.trim()) return { flagged: false };
  if (CONTACT_PHRASE_PATTERN.test(text)) {
    return { flagged: true, reason: "contact-phrase" };
  }
  if (PHONE_PATTERN.test(text)) {
    return { flagged: true, reason: "phone-number" };
  }
  if (EMAIL_PATTERN.test(text)) {
    return { flagged: true, reason: "email" };
  }
  if (URL_PATTERN.test(text)) {
    return { flagged: true, reason: "external-link" };
  }
  return { flagged: false };
}
