import { Client } from '@elastic/elasticsearch';

let instance: Client | null = null;

export const getElasticsearchClient = (): Client => {
  if (!instance) {
    const host = process.env.ELASTIC_SEARCH_HOST || 'http://localhost:9200';
    instance = new Client({ node: host });
  }
  return instance;
};

export const indexDocument = async (index: string, id: string, document: any): Promise<any> => {
  const client = getElasticsearchClient();
  const response = await client.index({
    index,
    id,
    body: document
  });
  return response.body;
};

export const deleteDocument = async (index: string, id: string): Promise<any> => {
  const client = getElasticsearchClient();
  const response = await client.delete({
    index,
    id
  });
  return response.body;
};

export const searchDocuments = async (index: string, query: any): Promise<any[]> => {
  const client = getElasticsearchClient();
  const response = await client.search({
    index,
    body: { query }
  });
  const hits = response.body.hits.hits.map((hit: any) => hit._source);
  return hits;
};
