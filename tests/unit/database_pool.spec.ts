import path from 'path';
import db from '../../src/models';

describe('Database Connection Pool Configuration (TDD)', () => {
  it('should have pool configuration defined in src/config/config.json for all environments', () => {
    const configPath = path.join(__dirname, '../../src/config/config.json');
    const config = require(configPath);

    expect(config.development).toBeDefined();
    expect(config.development.pool).toBeDefined();
    expect(config.development.pool.max).toBeGreaterThanOrEqual(1);
    expect(config.development.pool.idle).toBeGreaterThan(0);

    expect(config.test).toBeDefined();
    expect(config.test.pool).toBeDefined();
    expect(config.test.pool.max).toBeGreaterThanOrEqual(1);

    expect(config.production).toBeDefined();
    expect(config.production.pool).toBeDefined();
    expect(config.production.pool.max).toBeGreaterThanOrEqual(10);
    expect(config.production.pool.acquire).toBeGreaterThanOrEqual(20000);
  });

  it('should propagate pool options to the active Sequelize instance', () => {
    expect(db.sequelize).toBeDefined();
    const poolConfig = db.sequelize.options?.pool || (db.sequelize as any).config?.pool;
    expect(poolConfig).toBeDefined();
    expect(poolConfig.max).toBeGreaterThanOrEqual(1);
  });
});
