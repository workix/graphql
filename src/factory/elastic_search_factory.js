const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'http://localhost:9200',
  //auth: { apiKey: 'base64EncodedKey' }
})

export default client;