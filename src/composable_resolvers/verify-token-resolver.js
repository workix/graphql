import * as jwt from 'jsonwebtoken'

export const verifyTokenResolver = resolver => {
    return (parent, args, context, info) => {
        const token = context.authorization ? context.authorization.split(" ")[1] : undefined

        return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (!err) {
                return resolver(parent, args, context, info)
            } else {
                throw new Error(`${err.name}: ${err.message}`)
            }
        })

    }
}