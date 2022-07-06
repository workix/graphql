import 'dotenv/config'
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "graphql-tools";

import resolvers from "./resolvers";
import typeDefs from "./schemas";


import "express-async-errors";
import db from './models/index';

import { DataLoaderFactory } from './dataloader';
import { RequestedFields } from './RequestedFields';
import { extractJWTMiddleware } from './middleware/extract_jwt'

const app = express();
const requestedFields = new RequestedFields();
const dataLoaderFactory = new DataLoaderFactory(db, requestedFields);


app.use(express.json());


const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});



app.use("/graphql",
  extractJWTMiddleware(),
  (req, res, next) => {
    if (!req["context"]) req["context"] = {}
    req["context"]['orm'] = db;
    req["context"]['dataloaders'] = dataLoaderFactory.getLoaders();
    req["context"]['requestedFields'] = requestedFields;
    next();
  },
  graphqlHTTP(req => ({
    schema,
    graphiql: true,
    context: req['context']
  }))
);

app.use('/', (req, res) => res.send({ msg: "Workix Graphql" }))

app.use(
  (error, request, response, next) => {
    if (error instanceof Error) {
      return response.status(400).json({ message: error.message });
    }

    return response.status(500).json(error);
  }
);

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`Server is running at Port ${port}`)
  console.log(`http://localhost:${port}/graphql`)
});