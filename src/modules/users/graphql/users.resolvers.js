const { QueryTypes } = require('sequelize');
import { User } from '../../../models';
import usersRepository from '../repository/users.repo';

const usersResolvers = {
    Query: {       
          allUsers: async (parent, args, ctx, info) => {            
            const users = usersRepository(ctx.orm).findAll(info)
            return users;
          }
          
    },
}

export default usersResolvers;