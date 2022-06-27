import _ from 'lodash';
const { QueryTypes } = require('sequelize');
// import { Job } from '../../../models';

const jobsResolvers = {
    Query: {       
          allJobs: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: ["id", "company_id"], exclude: ["company", "candidates"] })            
            const sql = `SELECT ${fields.toString()} FROM jobs ORDER BY id ASC`
            const forms = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return forms;
          }          
    },
    Job: {
        company: async (parent, args, ctx, info) => {
            const companies = await ctx.dataloaders.companiesLoader.load({key: parent.company_id, info})    
            return companies[0]; 
        },
        candidates: async (parent, args, ctx, info) => {            
            
            const subIds = await ctx.dataloaders.candidatesSubscribedJobsLoader.load({key: parent.id, info})                

            const candidates_ids = subIds.length ? subIds.map(i => ({key: i.candidate_id, info: info})) : []                      
            
            const candidates = await ctx.dataloaders.candidatesLoader.loadMany(candidates_ids)    
            
            return _.flatten(candidates);  
        }
    }    
}

export default jobsResolvers;