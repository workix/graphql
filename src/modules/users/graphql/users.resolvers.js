import usersRepository from '../repository/users.repo';
import { createIndex, deleteIndex, matchAnyFields, updateIndex } from '../elasticSearch/users.elastic';
import UserDTO from '../../../dtos/UserDTO';


const usersResolvers = {
  Query: {
    allUsers: async (parent, args, ctx, info) => {
      const users = await usersRepository(ctx.orm).findAll(info, args)
      const usersDTO = users.map(u => new UserDTO(u))
      return usersDTO;
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
      const results = await matchAnyFields(args.term)
      return results
    }
  },
  Mutation: {
    createUser: async (parent, args, ctx, info) => {
      const user = await usersRepository(ctx.orm).create(args)

      await createIndex(user)

      const message = {action: "welcome", user}
      
      await ctx.mqserver.publishInQueue('notifications', JSON.stringify(message));

      return user;
    },
    deleteUser: async (parent, args, ctx, info) => {
      const deleted = await usersRepository(ctx.orm).destroy(args)

      await deleteIndex(args.id)

      return deleted;
    },
    updateUser: async (parent, args, ctx, info) => {
      const user = await usersRepository(ctx.orm).update(args)

      await updateIndex(user)

      return user;
    }
  }
}

export default usersResolvers;