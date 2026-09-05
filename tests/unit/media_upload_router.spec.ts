import { Router, Request, Response } from 'express';
import { createMediaRouter } from '../../src/modules/media/media.router';
import { MediaAsset } from '../../src/models';

jest.mock('../../src/models', () => ({
  MediaAsset: {
    findByPk: jest.fn(),
    create: jest.fn()
  }
}));

describe('Media Upload Router Unit Tests', () => {
  let router: Router;

  beforeEach(() => {
    jest.clearAllMocks();
    router = createMediaRouter();
  });

  const getRouteHandler = (path: string, method: 'put' | 'post') => {
    const route = (router as any).stack.find(
      (layer: any) => layer.route && layer.route.path === path && layer.route.methods[method]
    );
    if (!route) {
      throw new Error(`Handler for ${method.toUpperCase()} ${path} not found`);
    }
    return route.route.stack[0].handle;
  };

  it('deve rejeitar upload quando o MediaAsset não for encontrado', async () => {
    (MediaAsset.findByPk as jest.Mock).mockResolvedValue(null);

    const handler = getRouteHandler('/upload/:id', 'post');

    const req: any = {
      params: { id: '999' },
      body: Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.stringContaining('não encontrado')
    }));
  });

  it('deve realizar upload e validação de Magic Bytes para imagem PNG válida', async () => {
    const mockAsset = {
      id: 123,
      file_name: 'avatar.png',
      context: 'AVATAR',
      update: jest.fn().mockResolvedValue(true)
    };
    (MediaAsset.findByPk as jest.Mock).mockResolvedValue(mockAsset);

    const handler = getRouteHandler('/upload/:id', 'post');

    const validPngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00]);

    const req: any = {
      params: { id: '123' },
      body: validPngHeader
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      url: expect.stringContaining('/uploads/media/'),
      mediaAsset: expect.objectContaining({
        fileType: 'image/png',
        status: 'READY'
      })
    }));
    expect(mockAsset.update).toHaveBeenCalledWith(expect.objectContaining({
      status: 'READY',
      file_type: 'image/png'
    }));
  });

  it('deve rejeitar upload de arquivo malicioso ou não reconhecido', async () => {
    const mockAsset = {
      id: 123,
      file_name: 'fake.png',
      context: 'AVATAR',
      update: jest.fn()
    };
    (MediaAsset.findByPk as jest.Mock).mockResolvedValue(mockAsset);

    const handler = getRouteHandler('/upload/:id', 'post');

    const maliciousBuffer = Buffer.from('<?php echo "evil"; ?>');

    const req: any = {
      params: { id: '123' },
      body: maliciousBuffer
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.stringContaining('não reconhecido')
    }));
  });

  it('deve suportar direct-upload criando o registro e salvando o arquivo', async () => {
    const mockCreatedAsset = {
      id: 456,
      update: jest.fn().mockResolvedValue(true)
    };
    (MediaAsset.create as jest.Mock).mockResolvedValue(mockCreatedAsset);

    const handler = getRouteHandler('/direct-upload', 'post');

    const validPdfBuffer = Buffer.from('%PDF-1.4 header dummy content');

    const req: any = {
      headers: {
        'x-file-name': 'curriculo.pdf',
        'x-file-context': 'RESUME'
      },
      query: {},
      body: validPdfBuffer
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      mediaAsset: expect.objectContaining({
        fileType: 'application/pdf',
        status: 'READY'
      })
    }));
    expect(mockCreatedAsset.update).toHaveBeenCalledWith(expect.objectContaining({
      status: 'READY'
    }));
  });
});
