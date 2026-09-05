import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { MediaAsset } from '../../models';
import { fileSecurityValidator } from '../../utils/file_security_validator';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'media');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const createMediaRouter = (): Router => {
  const router = Router();

  /**
   * Endpoint de upload binário direto ou multipart para um MediaAsset existente.
   */
  const handleUpload = async (req: Request, res: Response): Promise<void> => {
    try {
      const assetId = req.params.id;
      const mediaAsset = await MediaAsset.findByPk(assetId);

      if (!mediaAsset) {
        res.status(404).json({ error: `MediaAsset com id ${assetId} não encontrado.` });
        return;
      }

      let buffer: Buffer;
      let originalName = mediaAsset.file_name || 'upload.bin';

      const reqAny = req as any;
      if (reqAny.file && reqAny.file.buffer) {
        buffer = reqAny.file.buffer;
        originalName = reqAny.file.originalname || originalName;
      } else if (Buffer.isBuffer(req.body)) {
        buffer = req.body;
      } else if (req.body && typeof req.body === 'string') {
        buffer = Buffer.from(req.body, 'binary');
      } else {
        res.status(400).json({ error: 'Nenhum arquivo enviado ou payload binário ausente.' });
        return;
      }

      // Validação de segurança e Magic Bytes
      const validation = fileSecurityValidator.validate(buffer, originalName, {
        allowedCategories: ['all'],
        maxSizeBytes: 25 * 1024 * 1024
      });

      if (!validation.isValid) {
        res.status(400).json({ error: validation.error || 'Arquivo inválido ou não seguro.' });
        return;
      }

      const safeFileName = `${assetId}-${Date.now()}-${validation.sanitizedFilename}`;
      const filePath = path.join(UPLOAD_DIR, safeFileName);
      await fs.promises.writeFile(filePath, buffer);

      const appUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 4000}`;
      const publicUrl = `${appUrl}/uploads/media/${safeFileName}`;

      await mediaAsset.update({
        url: publicUrl,
        file_name: validation.sanitizedFilename,
        file_type: validation.mimeType,
        status: 'READY'
      });

      res.status(200).json({
        success: true,
        url: publicUrl,
        mediaAsset: {
          id: mediaAsset.id,
          fileName: validation.sanitizedFilename,
          fileType: validation.mimeType,
          context: mediaAsset.context,
          url: publicUrl,
          status: 'READY'
        }
      });
    } catch (err: any) {
      console.error('Erro no processamento do upload:', err);
      res.status(500).json({ error: 'Falha interna ao processar o upload do arquivo.' });
    }
  };

  router.put('/upload/:id', handleUpload);
  router.post('/upload/:id', handleUpload);

  /**
   * Endpoint de upload direto unificado (cria o registro e salva o arquivo em um único passo).
   */
  router.post('/direct-upload', async (req: Request, res: Response): Promise<void> => {
    try {
      let buffer: Buffer;
      let originalName = (req.headers['x-file-name'] as string) || (req.query.fileName as string) || 'upload.bin';
      const context = (req.headers['x-file-context'] as string) || (req.query.context as string) || 'GENERAL';

      if (Buffer.isBuffer(req.body)) {
        buffer = req.body;
      } else if (req.body && typeof req.body === 'string') {
        buffer = Buffer.from(req.body, 'binary');
      } else {
        res.status(400).json({ error: 'Nenhum payload binário enviado.' });
        return;
      }

      const validation = fileSecurityValidator.validate(buffer, originalName, {
        allowedCategories: ['all'],
        maxSizeBytes: 25 * 1024 * 1024
      });

      if (!validation.isValid) {
        res.status(400).json({ error: validation.error || 'Arquivo inválido ou não seguro.' });
        return;
      }

      const mediaAsset = await MediaAsset.create({
        file_name: validation.sanitizedFilename,
        file_type: validation.mimeType,
        context,
        status: 'PENDING',
        url: null
      });

      const safeFileName = `${mediaAsset.id}-${Date.now()}-${validation.sanitizedFilename}`;
      const filePath = path.join(UPLOAD_DIR, safeFileName);
      await fs.promises.writeFile(filePath, buffer);

      const appUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 4000}`;
      const publicUrl = `${appUrl}/uploads/media/${safeFileName}`;

      await mediaAsset.update({
        url: publicUrl,
        status: 'READY'
      });

      res.status(200).json({
        success: true,
        url: publicUrl,
        mediaAsset: {
          id: mediaAsset.id,
          fileName: validation.sanitizedFilename,
          fileType: validation.mimeType,
          context,
          url: publicUrl,
          status: 'READY'
        }
      });
    } catch (err: any) {
      console.error('Erro no direct-upload:', err);
      res.status(500).json({ error: 'Falha interna ao realizar upload direto.' });
    }
  });

  return router;
};

export default createMediaRouter;
