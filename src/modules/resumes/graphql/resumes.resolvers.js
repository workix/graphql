const { QueryTypes } = require('sequelize');
// import { Resume } from '../../../models';

const resumesResolvers = {
    Query: {       
          allResumes: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: ["candidate_id"], exclude: ["candidate"] })            
            const sql = `SELECT ${fields.toString()} FROM resumes ORDER BY id ASC`
            const resumes = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return resumes;
          }          
    },
    Resume: {
        candidate: async (parent, args, ctx, info) => {
            const candidates = await ctx.dataloaders.candidatesLoader.load({key: parent.candidate_id, info})
          return candidates[0];  
        }
    },
    CarrerLevel: {
        JUNIOR: 0,
        MIDDLE: 1,
        SENIOR: 2,
        EXPERT: 3
    },
    Presence: {
        REMOTE: 0,
        OFFICE: 1,
        RELOCATION: 2,
        TRAVEL_A_LOT: 3
    }    
}

export default resumesResolvers;