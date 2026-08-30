import { handleSearchIndexerMessage, processSearchIndexingMessage } from '../../../src/workers/search_indexer_worker';
import * as esServer from '../../../src/factory/elasticsearch_server';

jest.mock('../../../src/factory/elasticsearch_server', () => ({
  indexDocument: jest.fn().mockResolvedValue({ result: 'created' }),
  deleteDocument: jest.fn().mockResolvedValue({ result: 'deleted' })
}));

describe('Search Indexer Worker Unit Tests (TDD)', () => {
  it('should process INDEX action', async () => {
    const payload = { action: 'INDEX', index: 'profiles', id: '1', document: { name: 'John' } };
    const res = await processSearchIndexingMessage(JSON.stringify(payload));

    expect(esServer.indexDocument).toHaveBeenCalledWith('profiles', '1', { name: 'John' });
    expect(res).toEqual({ result: 'created' });
  });

  it('should process DELETE action', async () => {
    const payload = { action: 'DELETE', index: 'profiles', id: '1' };
    const res = await processSearchIndexingMessage(JSON.stringify(payload));

    expect(esServer.deleteDocument).toHaveBeenCalledWith('profiles', '1');
    expect(res).toEqual({ result: 'deleted' });
  });

  it('should handle invalid JSON message gracefully', async () => {
    const res = await processSearchIndexingMessage('invalid-json');
    expect(res).toBeNull();
  });

  it('should handle rabbitmq message callback', async () => {
    const mockMsg = { content: Buffer.from(JSON.stringify({ action: 'DELETE', index: 'posts', id: '10' })) };
    const res = await handleSearchIndexerMessage(mockMsg);

    expect(esServer.deleteDocument).toHaveBeenCalledWith('posts', '10');
    expect(res).toEqual({ result: 'deleted' });
  });

  it('should return null for null msg or missing content', async () => {
    expect(await handleSearchIndexerMessage(null)).toBeNull();
    expect(await handleSearchIndexerMessage({})).toBeNull();
  });
});
