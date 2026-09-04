import { FileSecurityValidator } from '../../src/utils/file_security_validator';

describe('FileSecurityValidator Unit Tests', () => {
  let validator: FileSecurityValidator;

  beforeEach(() => {
    validator = FileSecurityValidator.getInstance();
  });

  describe('Magic Bytes Detection', () => {
    it('should detect valid PDF binary buffer', () => {
      const pdfBuffer = Buffer.from('%PDF-1.7\n%Header content');
      const result = validator.detectFormat(pdfBuffer);
      expect(result.format).toBe('pdf');
      expect(result.mimeType).toBe('application/pdf');
    });

    it('should detect valid PNG binary buffer', () => {
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00]);
      const result = validator.detectFormat(pngBuffer);
      expect(result.format).toBe('png');
      expect(result.mimeType).toBe('image/png');
    });

    it('should detect valid JPEG binary buffer', () => {
      const jpegBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46]);
      const result = validator.detectFormat(jpegBuffer);
      expect(result.format).toBe('jpeg');
      expect(result.mimeType).toBe('image/jpeg');
    });

    it('should detect valid WEBP binary buffer', () => {
      // RIFF (4 bytes) + 4 bytes size + WEBP (4 bytes)
      const webpBuffer = Buffer.from([
        0x52, 0x49, 0x46, 0x46,
        0x20, 0x00, 0x00, 0x00,
        0x57, 0x45, 0x42, 0x50,
        0x56, 0x50, 0x38
      ]);
      const result = validator.detectFormat(webpBuffer);
      expect(result.format).toBe('webp');
      expect(result.mimeType).toBe('image/webp');
    });

    it('should return unknown for non-matching or executable binary', () => {
      const exeBuffer = Buffer.from([0x4D, 0x5A, 0x90, 0x00]); // MZ executable
      const result = validator.detectFormat(exeBuffer);
      expect(result.format).toBe('unknown');
    });
  });

  describe('Filename Sanitization', () => {
    it('should sanitize path traversal patterns and dangerous characters', () => {
      expect(validator.sanitizeFilename('../../etc/passwd.pdf')).toBe('passwd.pdf');
      expect(validator.sanitizeFilename('..\\..\\windows\\system32.jpg')).toBe('system32.jpg');
      expect(validator.sanitizeFilename('my resume (1) [final]!.pdf')).toBe('my_resume__1___final__.pdf');
    });

    it('should provide safe fallback for empty or dotted filenames', () => {
      const sanitized = validator.sanitizeFilename('');
      expect(sanitized).toContain('upload-');
    });
  });

  describe('Full Validation & Constraints', () => {
    it('should successfully validate an allowed document upload', () => {
      const pdfBuffer = Buffer.from('%PDF-1.4\nsample resume stream');
      const validation = validator.validate(pdfBuffer, 'curriculo.pdf', {
        allowedCategories: ['document']
      });

      expect(validation.isValid).toBe(true);
      expect(validation.detectedFormat).toBe('pdf');
      expect(validation.sanitizedFilename).toBe('curriculo.pdf');
    });

    it('should reject file when format is not in allowed formats list', () => {
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
      const validation = validator.validate(pngBuffer, 'foto.png', {
        allowedFormats: ['pdf']
      });

      expect(validation.isValid).toBe(false);
      expect(validation.error).toContain('Formato PNG não é permitido');
    });

    it('should reject file that exceeds maximum size limit', () => {
      const largeBuffer = Buffer.alloc(1024 * 1024 * 5); // 5MB
      largeBuffer[0] = 0x25;
      largeBuffer[1] = 0x50;
      largeBuffer[2] = 0x44;
      largeBuffer[3] = 0x46; // %PDF

      const validation = validator.validate(largeBuffer, 'large.pdf', {
        maxSizeBytes: 2 * 1024 * 1024 // 2MB max
      });

      expect(validation.isValid).toBe(false);
      expect(validation.error).toContain('excede o limite máximo permitido');
    });
  });
});
