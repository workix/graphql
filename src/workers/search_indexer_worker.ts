import { indexDocument, deleteDocument } from '../factory/elasticsearch_server';

export const processSearchIndexingMessage = async (rawMessage: string): Promise<any> => {
  try {
    const data = JSON.parse(rawMessage);
    const { action, index, id, document } = data;

    if (action === 'INDEX') {
      return await indexDocument(index, id, document);
    } else if (action === 'DELETE') {
      return await deleteDocument(index, id);
    }
    return null;
  } catch (error) {
    console.error('Error processing search indexer message:', error);
    return null;
  }
};

export const handleSearchIndexerMessage = async (msg: any): Promise<any> => {
  if (!msg || !msg.content) return null;
  const contentStr = msg.content.toString();
  return await processSearchIndexingMessage(contentStr);
};
