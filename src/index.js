var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const {Author} = require('./models');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
    allAuthors: [Author]    
  },
  type Author {
    id: ID,
    createdAt: String
    updatedAt: String
    uuid: String
    version: Int
    aboutText: String
    name: String
    picture: String    
  }  
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  allAuthors: async () => {
    return await Author.findAll();
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');