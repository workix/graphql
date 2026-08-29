import { encodeToBase64, decodeFromBase64 } from '../../../src/utils/Base64EncoderDecoder';
import { encrypt, compare } from '../../../src/utils/BcryptEncoderDecoder';

describe('Utils - Base64 & Bcrypt Encoders', () => {
  describe('Base64EncoderDecoder', () => {
    it('should encode string to base64 and decode it back', () => {
      const original = 'Hello Workix GraphQL!';
      const encoded = encodeToBase64(original);
      expect(encoded).not.toBe(original);
      const decoded = decodeFromBase64(encoded);
      expect(decoded).toBe(original);
    });
  });

  describe('BcryptEncoderDecoder', () => {
    it('should encrypt password and verify match correctly', () => {
      const password = 'mySecretPassword123';
      const hash = encrypt(password);
      expect(hash).not.toBe(password);
      expect(compare(password, hash)).toBe(true);
      expect(compare('wrongPassword', hash)).toBe(false);
    });
  });
});
