import { validateCPF } from "../../../validation/cpfValidator";


const othersResolvers = {
    Query: {
        validateCPF: (parent, args, ctx, info) => {
            const valid = validateCPF(args.cpf)
            return valid;
        }
    },
    Mutation: {

    }
}

export default othersResolvers;
