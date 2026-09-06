import * as jwt from 'jsonwebtoken';

export const verifyTokenResolver = resolver => {
    return (parent, args, context, info) => {
        const token = context.authorization ? context.authorization.split(" ")[1] : undefined;
        const secret = process.env.JWT_SECRET || 'SECRET';

        return jwt.verify(token, secret, (err, decoded) => {
            if (!err) {
                return resolver(parent, args, context, info);
            } else {
                throw new Error(`${err.name}: ${err.message}`);
            }
        });
    };
};