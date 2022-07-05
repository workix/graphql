import testimonialsRepository from '../repository/testimonials.repo'
// import { Testimonial } from '../../../models';


const testimonialsResolvers = {
  Query: {
    allTestimonials: async (parent, args, ctx, info) => {
      const testimonials = await testimonialsRepository(ctx.orm).findAll(info, args)
      return testimonials;
    },
    getTestimonialById: async (parent, args, ctx, info) => {
      const testimonial = await testimonialsRepository(ctx.orm).findById(info, args)
      return testimonial;
    },
    allTestimonialsPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await testimonialsRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    }
  },
  Mutation: {
    createTestimonial: async (parent, args, ctx, info) => {
      const testimonial = await testimonialsRepository(ctx.orm).create(args)
      return testimonial;
    },
    deleteTestimonial: async (parent, args, ctx, info) => {
      const deleted = await testimonialsRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateTestimonial: async (parent, args, ctx, info) => {
      const testimonial = await testimonialsRepository(ctx.orm).update(args)
      return testimonial;
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