import FormDTO from '../../../dtos/FormDTO';
import formsRepository from '../repository/forms.repo'

const formsResolvers = {
  Query: {
    allForms: async (parent, args, ctx, info) => {
      let forms = await formsRepository(ctx.orm).findAll(info, args)
      forms = forms.map(f => new FormDTO(f))
      return forms;
    },
    getFormById: async (parent, args, ctx, info) => {
      const form = await formsRepository(ctx.orm).findById(info, args)
      return new FormDTO(form);
    },
    allFormsPaginated: async (parent, args, ctx, info) => {
      const paginatedList = await formsRepository(ctx.orm).findAllPaginated(info, args)
      return paginatedList;
    }
  },
  Mutation: {
    createForm: async (parent, args, ctx, info) => {
      const form = await formsRepository(ctx.orm).create(args)
      return new FormDTO(form);
    },
    deleteForm: async (parent, args, ctx, info) => {
      const deleted = await formsRepository(ctx.orm).destroy(args)          
      return deleted;
    },
    updateForm: async (parent, args, ctx, info) => {
      const form = await formsRepository(ctx.orm).update(args)
      return new FormDTO(form);
    }
}
}

export default formsResolvers;
