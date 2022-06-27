const { QueryTypes } = require('sequelize');
// import { Subscriber } from '../../../models';

const subscribersResolvers = {
    Query: {       
          allSubscribers: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: [], exclude: [] })            
            const sql = `SELECT ${fields.toString()} FROM subscribers ORDER BY id ASC`
            const subscribers = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return subscribers;
          }
          
    }    
}

export default subscribersResolvers;