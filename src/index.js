import express from "express";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "graphql-tools";

import resolvers from "./resolvers";
import typeDefs from "./schemas";


import "express-async-errors";

const app = express();

app.use(express.json());


const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.use(
  (error, request, response, next) => {
    if (error instanceof Error) {
      return response.status(400).json({message: error.message});
    }

    return response.status(500).json(error);
  }
);

app.listen(4000, () => console.log("Server is running"));