export const authResolver = resolver => {
    return (parent, args, context, info) => {

        if (context.user || context.authorization) {
            return resolver(parent, args, context, info)
        }else {
            throw new Error('Unauthorized! Token not provided')
        }
    }
}