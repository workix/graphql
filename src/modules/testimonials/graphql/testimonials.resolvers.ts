import TestimonialDTO from '../../../dtos/TestimonialDTO';
import AuthorDTO from '../../../dtos/AuthorDTO';
import testimonialsRepository from '../repository/testimonials.repo'
// import { Testimonial } from '../../../models';


const testimonialsResolvers = {
  Query: {
    allTestimonials: async (parent, args, ctx, info) => {
      let testimonials = await testimonialsRepository(ctx.orm).findAll(info, args)
      testimonials = testimonials.map(t => new TestimonialDTO(t))
      return testimonials;
    },
    getTestimonialById: async (parent, args, ctx, info) => {
      const testimonial = await testimonialsRepository(ctx.orm).findById(info, args)
      return new TestimonialDTO(testimonial) ;
    },
    allTestimonialsPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await testimonialsRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    }
  },
  Mutation: {
    createTestimonial: async (parent, args, ctx, info) => {
      const testimonial = await testimonialsRepository(ctx.orm).create(args)
      return new TestimonialDTO(testimonial);
    },
    deleteTestimonial: async (parent, args, ctx, info) => {
      const deleted = await testimonialsRepository(ctx.orm).destroy(args)
      return deleted;
    },
    updateTestimonial: async (parent, args, ctx, info) => {
      const testimonial = await testimonialsRepository(ctx.orm).update(args)
      return new TestimonialDTO(testimonial);
    }
  },
  Testimonial: {
    author: async (parent, args, ctx, info) => {
      const authors = await ctx.dataloaders.authorLoader.load({ key: parent.authorId, info })
      return new AuthorDTO(authors[0]);
    }
  }
}

export default testimonialsResolvers;
