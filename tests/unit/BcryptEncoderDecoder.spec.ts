import { encrypt, compare } from '../../src/utils/BcryptEncoderDecoder';

describe('BcryptEncoderDecoder (Async TDD)', () => {
  it('should encrypt string asynchronously returning a Promise with bcrypt hash', async () => {
    const password = 'mySecretPassword123';
    const hashPromise = encrypt(password);
    
    // Deve retornar uma Promise (assíncrono, não bloqueante do Event Loop)
    expect(hashPromise).toBeInstanceOf(Promise);

    const hash = await hashPromise;
    expect(typeof hash).toBe('string');
    expect(hash).not.toBe(password);
    expect(hash.startsWith('$2')).toBe(true);
  });

  it('should compare raw password with valid hash asynchronously returning true', async () => {
    const password = 'mySecretPassword123';
    const hash = await encrypt(password);

    const matchPromise = compare(password, hash);
    expect(matchPromise).toBeInstanceOf(Promise);

    const isMatch = await matchPromise;
    expect(isMatch).toBe(true);
  });

  it('should compare invalid password with hash asynchronously returning false', async () => {
    const password = 'mySecretPassword123';
    const hash = await encrypt(password);

    const isMatch = await compare('wrongPassword', hash);
    expect(isMatch).toBe(false);
  });

  it('should generate different salts for different encryption calls of the same password', async () => {
    const password = 'samePassword';
    const [hash1, hash2] = await Promise.all([encrypt(password), encrypt(password)]);

    expect(hash1).not.toBe(hash2);
    expect(await compare(password, hash1)).toBe(true);
    expect(await compare(password, hash2)).toBe(true);
  });
});
