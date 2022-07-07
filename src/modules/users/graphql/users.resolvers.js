import usersRepository from '../repository/users.repo';
import client from '../../../factory/elastic_search_factory';

const usersResolvers = {
  Query: {
    allUsers: async (parent, args, ctx, info) => {
      const users = await usersRepository(ctx.orm).findAll(info, args)
      return users;
    },
    getUserById: async (parent, args, ctx, info) => {
      const user = await usersRepository(ctx.orm).findById(info, args)
      return user;
    },
    allUsersPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await usersRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    },
    deepSearchUser: async (parent, args, ctx, info) => {
      const result = await client.search({
        index: 'users',
        body: {
          query: {
            multi_match: {
              query: args.term,
              fields: ['id', 'uuid', 'email', 'firebaseUUID', 'firebaseMessageToken']
            }
          }
        }

      })

      const results = result.body.hits.hits.map(i => ({ id: i['_id'], user: i["_source"], score: i['_score'] }))
      return results
    }
  },
  Mutation: {
    createUser: async (parent, args, ctx, info) => {
      const user = await usersRepository(ctx.orm).create(args)

      const result = await client.index({
        index: 'users',
        id: user.uuid,
        body: user
      })

      return user;
    },
    deleteUser: async (parent, args, ctx, info) => {
      const deleted = await usersRepository(ctx.orm).destroy(args)

      /*
      const result = await client.delete({
        index: 'users',
        id: args.uuid
      })
    */

      return deleted;
    },
    updateUser: async (parent, args, ctx, info) => {
      const user = await usersRepository(ctx.orm).update(args)

      const result = await client.update({
        index: "users",
        type: "_doc",
        id: user.uuid,
        body: { doc: user }
      })

      return user;
    }
  }
}

export default usersResolvers;