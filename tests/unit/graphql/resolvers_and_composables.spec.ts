import resolvers from '../../../src/resolvers';
import { compose } from '../../../src/composable_resolvers/composable.resolver';
import { authResolver } from '../../../src/composable_resolvers/auth-resolver';
import { verifyTokenResolver } from '../../../src/composable_resolvers/verify-token-resolver';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

describe('GraphQL - Resolvers Merging & Composable Resolvers', () => {
  describe('resolvers index', () => {
    it('should export merged resolvers containing Query and Mutation objects', () => {
      expect(resolvers).toHaveProperty('Query');
      expect(resolvers).toHaveProperty('Mutation');
    });
  });

  describe('compose function', () => {
    it('should return identity function if no funcs passed', () => {
      const identity = compose();
      expect(identity('test')).toBe('test');
    });

    it('should return single func if 1 func passed', () => {
      const fn = (x: number) => x * 2;
      expect(compose(fn)).toBe(fn);
    });

    it('should compose multiple middleware functions in right-to-left order', () => {
      const add2 = (next: (x: number) => number) => (x: number) => next(x) + 2;
      const mult3 = (next: (x: number) => number) => (x: number) => next(x) * 3;
      const base = (x: number) => x;

      const composed = compose(add2, mult3)(base);
      expect(composed(5)).toBe(17); // (5 * 3) + 2 = 17
    });
  });

  describe('authResolver middleware', () => {
    const mockResolver = jest.fn().mockReturnValue('SUCCESS');

    it('should call resolver if context.user or context.authorization is defined', () => {
      const wrapped = authResolver(mockResolver);

      expect(wrapped(null, {}, { user: { id: 1 } }, {} as any)).toBe('SUCCESS');
      expect(wrapped(null, {}, { authorization: 'Bearer token' }, {} as any)).toBe('SUCCESS');
      expect(mockResolver).toHaveBeenCalledTimes(2);
    });

    it('should throw Unauthorized error if neither user nor authorization is provided', () => {
      const wrapped = authResolver(mockResolver);
      expect(() => wrapped(null, {}, {}, {} as any)).toThrow('Unauthorized! Token not provided');
    });
  });

  describe('verifyTokenResolver middleware', () => {
    const mockResolver = jest.fn().mockReturnValue('VERIFIED_RESULT');

    beforeEach(() => {
      jest.clearAllMocks();
      process.env.JWT_SECRET = 'secret123';
    });

    it('should verify token and call resolver on success', () => {
      (jwt.verify as jest.Mock).mockImplementation((token, secret, cb) => {
        return cb(null, { userId: 1 });
      });

      const wrapped = verifyTokenResolver(mockResolver);
      const result = wrapped(null, {}, { authorization: 'Bearer mytoken' }, {} as any);

      expect(jwt.verify).toHaveBeenCalledWith('mytoken', 'secret123', expect.any(Function));
      expect(mockResolver).toHaveBeenCalled();
      expect(result).toBe('VERIFIED_RESULT');
    });

    it('should throw error if jwt.verify fails', () => {
      (jwt.verify as jest.Mock).mockImplementation((token, secret, cb) => {
        return cb({ name: 'JsonWebTokenError', message: 'invalid token' });
      });

      const wrapped = verifyTokenResolver(mockResolver);
      expect(() => wrapped(null, {}, { authorization: 'Bearer badtoken' }, {} as any)).toThrow('JsonWebTokenError: invalid token');
    });
  });
});
