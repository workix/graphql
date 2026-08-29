const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: process.env.ELASTIC_SEARCH_HOST || 'http://localhost:9200',
  //auth: { apiKey: 'base64EncodedKey' }
})

export default client;