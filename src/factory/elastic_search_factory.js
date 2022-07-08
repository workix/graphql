const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: process.env.ELASTIC_SEARCH_HOST,
  //auth: { apiKey: 'base64EncodedKey' }
})

export default client;