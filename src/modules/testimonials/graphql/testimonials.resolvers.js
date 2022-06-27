const { QueryTypes } = require('sequelize');
// import { Testimonial } from '../../../models';

const testimonialsResolvers = {
    Query: {       
          allTestimonials: async (parent, args, ctx, info) => {
            const fields = ctx.requestedFields.getFields(info, { keep: ["author_id"], exclude: ["author"] })            
            const sql = `SELECT ${fields.toString()} FROM testimonials ORDER BY id ASC`
            const testimonials = await ctx.orm.sequelize.query(sql, { type: QueryTypes.SELECT });
            return testimonials;
          }          
    },
    Testimonial: {
        author: async (parent, args, ctx, info) => {
        const authors = await ctx.dataloaders.authorLoader.load({ key: parent.author_id, info })
        return authors[0];
        }
    }    
}

export default testimonialsResolvers;