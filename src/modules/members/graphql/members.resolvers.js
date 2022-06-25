const { QueryTypes } = require('sequelize');
// import { Member } from '../../../models';

const membersResolvers = {
    Query: {       
          allMembers: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: [], exclude: ["medias"] })            
            const sql = `SELECT ${fields.toString()} FROM members ORDER BY id ASC`
            const members = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return members;
          }
          
    },
    Member:{
        medias: async (parent, args, ctx, info) => {        
          const medias = await ctx.dataloaders.memberMediaLoader.load({key: parent.id, info})
          return medias;
        }
      },
      MemberMedia:{
        owner: async (parent, args, ctx, info) => {        
          const members = await ctx.dataloaders.membersLoader.load({key: parent.id, info})
          return members[0];
        }
      }    
}

export default membersResolvers;