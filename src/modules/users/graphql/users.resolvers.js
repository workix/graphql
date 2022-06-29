import usersRepository from '../repository/users.repo';

const usersResolvers = {
    Query: {       
          allUsers: async (parent, args, ctx, info) => {            
            const users = await usersRepository(ctx.orm).findAll(info,args)
            return users;
          },
          getUserById: async (parent, args, ctx, info) => {
            const user = await usersRepository(ctx.orm).findById(info, args)
            return user;
          }                      
    },
    Mutation: {
        createUser: async (parent, args, ctx, info) => {
          const user = await usersRepository(ctx.orm).createUser(args)
          return user;
        }
    }
}

export default usersResolvers;