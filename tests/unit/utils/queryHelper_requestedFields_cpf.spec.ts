import { batchInsert, insert, update, insertOrUpdate, select, exclude } from '../../../src/utils/queryHelper';
import { RequestedFields } from '../../../src/RequestedFields';
import { validateCPF } from '../../../src/validation/cpfValidator';
import { QueryTypes } from 'sequelize';

describe('Utils - queryHelper, RequestedFields & cpfValidator', () => {
  describe('cpfValidator', () => {
    it('should validate valid CPF correctly', () => {
      expect(validateCPF('11144477735')).toBe(true);
      expect(validateCPF('52998224725')).toBe(true);
    });

    it('should reject invalid CPF or repeated digits', () => {
      expect(validateCPF('')).toBe(false);
      expect(validateCPF('11111111111')).toBe(false);
      expect(validateCPF('12345678900')).toBe(false);
    });
  });

  describe('RequestedFields', () => {
    let requestedFields: RequestedFields;

    beforeEach(() => {
      requestedFields = new RequestedFields();
    });

    it('should extract simple fields and format to snake_case', () => {
      const mockInfo = {
        fieldNodes: [
          {
            kind: 'Field',
            name: { value: 'userProfile' },
            selectionSet: {
              selections: [
                { kind: 'Field', name: { value: 'firstName' } },
                { kind: 'Field', name: { value: 'lastName' } }
              ]
            }
          }
        ]
      };

      const fields = requestedFields.getFields(mockInfo, undefined);
      expect(fields).toContain('first_name');
      expect(fields).toContain('last_name');
    });

    it('should handle keep and exclude options in getFields', () => {
      const mockInfo = {
        fieldNodes: [
          {
            kind: 'Field',
            name: { value: 'user' },
            selectionSet: {
              selections: [{ kind: 'Field', name: { value: 'id' } }]
            }
          }
        ]
      };

      const fieldsWithKeep = requestedFields.getFields(mockInfo, { keep: ['created_at'] });
      expect(fieldsWithKeep).toContain('id');
      expect(fieldsWithKeep).toContain('created_at');

      const fieldsWithExclude = requestedFields.getFields(mockInfo, { keep: ['id', 'user_id'], exclude: ['user_id'] });
      expect(fieldsWithExclude).toContain('id');
      expect(fieldsWithExclude).not.toContain('user_id');
    });

    it('should extract fields with subfields map', () => {
      const mockInfo = {
        fieldNodes: [
          {
            kind: 'Field',
            name: { value: 'candidates' },
            selectionSet: {
              selections: [
                {
                  kind: 'Field',
                  name: { value: 'locale' },
                  selectionSet: {
                    selections: [{ kind: 'Field', name: { value: 'city' } }]
                  }
                }
              ]
            }
          }
        ]
      };

      const map = requestedFields.getFieldsWithSubfields(mockInfo, { keep: ['id'], exclude: ['ignored'] });
      expect(map instanceof Map).toBe(true);
      expect(map.has('locale')).toBe(true);
    });
  });

  describe('queryHelper', () => {
    let mockConnection: any;

    beforeEach(() => {
      mockConnection = {
        query: jest.fn().mockImplementation((sql: string, opts: any) => Promise.resolve([{ id: 1, name: 'test' }]))
      };
    });

    it('should execute batchInsert query correctly', async () => {
      const date = new Date();
      const popData = [
        { name: 'Item 1', date: date, value: null },
        { name: 'Item 2', raw: '(SELECT 1)', value: undefined }
      ];

      await batchInsert('test_table', popData, mockConnection);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO "test_table"'),
        { type: QueryTypes.INSERT }
      );
    });

    it('should execute insert query with dates, nulls, and strings correctly', async () => {
      const date = new Date();
      const data = { name: 'Item Single', active: true, created_at: date, note: null, raw: '(NOW())' };
      await insert('test_table', data, mockConnection);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO "test_table"'),
        { type: QueryTypes.INSERT }
      );
    });

    it('should execute update query correctly', async () => {
      const date = new Date();
      const data = { id: 5, name: 'Updated Name', updated_at: date, raw: '(NOW())' };
      await update('test_table', data, mockConnection);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE "test_table" SET'),
        { type: QueryTypes.UPDATE }
      );
    });

    it('should route insertOrUpdate correctly based on id', async () => {
      await insertOrUpdate('test_table', { id: 1, name: 'Update' }, mockConnection);
      expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE'), { type: QueryTypes.UPDATE });

      await insertOrUpdate('test_table', { name: 'Insert' }, mockConnection);
      expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining('INSERT'), { type: QueryTypes.INSERT });
    });

    it('should execute select query with joins, where, and limits', async () => {
      const options = {
        select: [
          { table: 'test_table', column: 'name', as: 'user_name' },
          { table: 'test_table', column: 'email' }
        ],
        join: [{ on: 'test_table.user_id = users.id', type: 'LEFT JOIN', target: 'users' }],
        where: "active = 'true'",
        limit: 10,
        offset: 0
      };

      await select('test_table', options, mockConnection);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT "test_table".name as user_name, "test_table".email as email FROM "test_table" LEFT JOIN "users" ON test_table.user_id = users.id WHERE active = \'true\' LIMIT 10 OFFSET 0'),
        { type: QueryTypes.SELECT }
      );

      const simpleOptions = { limit: 5 };
      await select('test_table', simpleOptions, mockConnection);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM "test_table" LIMIT 5'),
        { type: QueryTypes.SELECT }
      );
    });

    it('should execute exclude query with conditions or id', async () => {
      await exclude('test_table', { id: 10 }, mockConnection);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM "test_table" WHERE id = 10 RETURNING *'),
        { type: QueryTypes.DELETE }
      );

      await exclude('test_table', { literal: "created_at < NOW()" }, mockConnection);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM "test_table" WHERE created_at < NOW() RETURNING *'),
        { type: QueryTypes.DELETE }
      );

      await exclude('test_table', {}, mockConnection);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM "test_table"'),
        { type: QueryTypes.DELETE }
      );
    });
  });
});
