import { getElasticsearchClient, indexDocument, deleteDocument, searchDocuments } from '../../../src/factory/elasticsearch_server';

const mockIndex = jest.fn().mockResolvedValue({ body: { result: 'created' } });
const mockDelete = jest.fn().mockResolvedValue({ body: { result: 'deleted' } });
const mockSearch = jest.fn().mockResolvedValue({ body: { hits: { hits: [{ _source: { id: 1, name: 'John' } }] } } });

jest.mock('@elastic/elasticsearch', () => ({
  Client: jest.fn().mockImplementation(() => ({
    index: mockIndex,
    delete: mockDelete,
    search: mockSearch
  }))
}));

describe('Elasticsearch Server Factory Unit Tests (TDD)', () => {
  it('should return singleton Client instance', () => {
    const client1 = getElasticsearchClient();
    const client2 = getElasticsearchClient();
    expect(client1).toBe(client2);
  });

  it('should index document successfully', async () => {
    const res = await indexDocument('profiles', '1', { id: 1, name: 'John' });
    expect(mockIndex).toHaveBeenCalledWith({
      index: 'profiles',
      id: '1',
      body: { id: 1, name: 'John' }
    });
    expect(res).toEqual({ result: 'created' });
  });

  it('should delete document successfully', async () => {
    const res = await deleteDocument('profiles', '1');
    expect(mockDelete).toHaveBeenCalledWith({
      index: 'profiles',
      id: '1'
    });
    expect(res).toEqual({ result: 'deleted' });
  });

  it('should search documents successfully', async () => {
    const hits = await searchDocuments('profiles', { match: { name: 'John' } });
    expect(mockSearch).toHaveBeenCalledWith({
      index: 'profiles',
      body: { query: { match: { name: 'John' } } }
    });
    expect(hits).toEqual([{ id: 1, name: 'John' }]);
  });
});
