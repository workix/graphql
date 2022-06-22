import {Author} from '../../../models';

const authorsResolvers = {
    Query: {
        hello: () => {
            return 'Hello world!';
          },
          allAuthors: async () => {
            return await Author.findAll();
          }
    },
    /*Mutation: {

    },*/
  };
  
  export default authorsResolvers;