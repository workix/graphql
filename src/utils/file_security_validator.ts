import path from 'path';

export type AllowedCategory = 'image' | 'document' | 'all';
export type DetectedFileFormat = 'pdf' | 'png' | 'jpeg' | 'webp' | 'unknown';

export interface FileValidationOptions {
  allowedCategories?: AllowedCategory[];
  allowedFormats?: DetectedFileFormat[];
  maxSizeBytes?: number;
}

export interface FileValidationResult {
  isValid: boolean;
  detectedFormat: DetectedFileFormat;
  mimeType: string;
  sanitizedFilename: string;
  sizeBytes: number;
  error?: string;
}

export class FileSecurityValidator {
  private static instance: FileSecurityValidator;

  // Limite padrão de 15MB
  private defaultMaxSizeBytes: number = 15 * 1024 * 1024;

  public static getInstance(): FileSecurityValidator {
    if (!FileSecurityValidator.instance) {
      FileSecurityValidator.instance = new FileSecurityValidator();
    }
    return FileSecurityValidator.instance;
  }

  /**
   * Detecta o formato real do arquivo inspecionando seus cabeçalhos binários (Magic Bytes).
   */
  public detectFormat(buffer: Buffer): { format: DetectedFileFormat; mimeType: string } {
    if (!buffer || buffer.length < 4) {
      return { format: 'unknown', mimeType: 'application/octet-stream' };
    }

    // 1. PDF: %PDF (0x25, 0x50, 0x44, 0x46)
    if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
      return { format: 'pdf', mimeType: 'application/pdf' };
    }

    // 2. PNG: \x89PNG\r\n\x1a\n (0x89, 0x50, 0x4E, 0x47)
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      return { format: 'png', mimeType: 'image/png' };
    }

    // 3. JPEG: \xFF\xD8\xFF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return { format: 'jpeg', mimeType: 'image/jpeg' };
    }

    // 4. WEBP: RIFF....WEBP (0x52 0x49 0x46 0x46 ... 0x57 0x45 0x42 0x50)
    if (
      buffer.length >= 12 &&
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
    ) {
      return { format: 'webp', mimeType: 'image/webp' };
    }

    return { format: 'unknown', mimeType: 'application/octet-stream' };
  }

  /**
   * Sanitiza nomes de arquivos para evitar Path Traversal e injeções no sistema de arquivos.
   */
  public sanitizeFilename(filename: string): string {
    if (!filename) {
      return `upload-${Date.now()}`;
    }

    // Remove qualquer path traversal e caracteres de separação de diretório
    let clean = path.basename(filename);
    clean = clean.replace(/\0/g, ''); // Remove null bytes
    clean = clean.replace(/[^a-zA-Z0-9._-]/g, '_'); // Permite apenas alfanumérico, ponto, underline e hífen
    clean = clean.replace(/\.{2,}/g, '.'); // Remove múltiplos pontos consecutivos (ex: ..)

    if (clean.length === 0 || clean.startsWith('.')) {
      clean = `file_${Date.now()}${clean}`;
    }

    return clean;
  }

  /**
   * Valida integralmente um buffer de arquivo contra regras de segurança, magic bytes e tamanho.
   */
  public validate(
    buffer: Buffer,
    originalFilename: string,
    options: FileValidationOptions = {}
  ): FileValidationResult {
    const sizeBytes = buffer ? buffer.length : 0;
    const maxSize = options.maxSizeBytes || this.defaultMaxSizeBytes;
    const sanitizedFilename = this.sanitizeFilename(originalFilename);

    // 1. Verificação de buffer vazio ou tamanho excedido
    if (!buffer || sizeBytes === 0) {
      return {
        isValid: false,
        detectedFormat: 'unknown',
        mimeType: 'application/octet-stream',
        sanitizedFilename,
        sizeBytes: 0,
        error: 'Arquivo vazio ou buffer inválido.'
      };
    }

    if (sizeBytes > maxSize) {
      return {
        isValid: false,
        detectedFormat: 'unknown',
        mimeType: 'application/octet-stream',
        sanitizedFilename,
        sizeBytes,
        error: `Tamanho do arquivo (${Math.round(sizeBytes / 1024)}KB) excede o limite máximo permitido (${Math.round(maxSize / 1024)}KB).`
      };
    }

    // 2. Detecção de cabeçalho binário real
    const { format, mimeType } = this.detectFormat(buffer);

    if (format === 'unknown') {
      return {
        isValid: false,
        detectedFormat: 'unknown',
        mimeType,
        sanitizedFilename,
        sizeBytes,
        error: 'Tipo de arquivo não reconhecido ou formato binário não permitido por motivos de segurança.'
      };
    }

    // 3. Verificação de formatos permitidos
    if (options.allowedFormats && options.allowedFormats.length > 0) {
      if (!options.allowedFormats.includes(format)) {
        return {
          isValid: false,
          detectedFormat: format,
          mimeType,
          sanitizedFilename,
          sizeBytes,
          error: `Formato ${format.toUpperCase()} não é permitido para este recurso.`
        };
      }
    }

    // 4. Verificação de categorias permitidas
    if (options.allowedCategories && options.allowedCategories.length > 0) {
      const isImage = ['png', 'jpeg', 'webp'].includes(format);
      const isDocument = format === 'pdf';

      const allowed = options.allowedCategories.some(cat => {
        if (cat === 'all') return true;
        if (cat === 'image' && isImage) return true;
        if (cat === 'document' && isDocument) return true;
        return false;
      });

      if (!allowed) {
        return {
          isValid: false,
          detectedFormat: format,
          mimeType,
          sanitizedFilename,
          sizeBytes,
          error: `Categoria do arquivo não permitida. Permitidas: ${options.allowedCategories.join(', ')}.`
        };
      }
    }

    return {
      isValid: true,
      detectedFormat: format,
      mimeType,
      sanitizedFilename,
      sizeBytes
    };
  }
}

export const fileSecurityValidator = FileSecurityValidator.getInstance();
