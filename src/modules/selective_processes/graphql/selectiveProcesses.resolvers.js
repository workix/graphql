import _ from 'lodash';
const { QueryTypes } = require('sequelize');
// import { SelectiveProcess } from '../../../models';

const selectiveProcessesResolvers = {
    Query: {       
          allSelectiveProcesses: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: ["job_id"], exclude: ["job", "candidates"] })            
            const sql = `SELECT ${fields.toString()} FROM selective_processes ORDER BY id ASC`
            const selectiveProcesses = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return selectiveProcesses;
          }          
    },
    SelectiveProcess: {
        job: async (parent, args, ctx, info) => {
            const jobs = await ctx.dataloaders.jobsLoader.load({key: parent.job_id, info})    
            return jobs[0]; 
        },
        candidates: async (parent, args, ctx, info) => {            
            
            const subIds = await ctx.dataloaders.candidatesSubscribedSPLoader.load({key: parent.id, info})                

            const candidates_ids = subIds.length ? subIds.map(i => ({key: i.candidate_id, info: info})) : []                      
            
            const candidates = await ctx.dataloaders.candidatesLoader.loadMany(candidates_ids)    
            
            return _.flatten(candidates); 

        }
    }    
}

export default selectiveProcessesResolvers;