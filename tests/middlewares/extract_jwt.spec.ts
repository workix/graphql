import { extractJWTMiddleware } from '../../src/middleware/extract_jwt';
import { User } from '../../src/models';
import jwt from 'jsonwebtoken';

describe('extractJWTMiddleware', () => {
  const secret = 'test-jwt-secret';

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve chamar next() e manter context sem usuário se não houver header authorization', () => {
    const middleware = extractJWTMiddleware();
    const req: any = { headers: {} };
    const res: any = {};
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.context).toBeDefined();
    expect(req.context.authorization).toBeUndefined();
    expect(req.context.user).toBeUndefined();
  });

  it('deve chamar next() sem autenticar se o token for inválido', (done) => {
    const middleware = extractJWTMiddleware();
    const req: any = {
      headers: {
        authorization: 'Bearer token-invalido'
      }
    };
    const res: any = {};
    const next = jest.fn(() => {
      expect(req.context.user).toBeUndefined();
      done();
    });

    middleware(req, res, next);
  });

  it('deve decodificar token válido e associar usuário ao context', (done) => {
    const payload = { id: 'fb-uuid-123', sub: 'teste@workix.com' };
    const validToken = jwt.sign(payload, secret);

    jest.spyOn(User, 'findOne').mockResolvedValue({
      id: 42,
      email: 'teste@workix.com',
      firebase_uuid: 'fb-uuid-123'
    } as any);

    const middleware = extractJWTMiddleware();
    const req: any = {
      headers: {
        authorization: `Bearer ${validToken}`
      }
    };
    const res: any = {};
    const next = jest.fn(() => {
      expect(req.context.user).toEqual({
        id: 42,
        email: 'teste@workix.com',
        firebase_uuid: 'fb-uuid-123'
      });
      done();
    });

    middleware(req, res, next);
  });

  it('deve chamar next() se o usuário não existir no banco de dados para o token decodificado', (done) => {
    const payload = { id: 'fb-unknown', sub: 'inexistente@workix.com' };
    const validToken = jwt.sign(payload, secret);

    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    const middleware = extractJWTMiddleware();
    const req: any = {
      headers: {
        authorization: `Bearer ${validToken}`
      }
    };
    const res: any = {};
    const next = jest.fn(() => {
      expect(req.context.user).toBeUndefined();
      done();
    });

    middleware(req, res, next);
  });
});
