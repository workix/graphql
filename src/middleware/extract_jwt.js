const jwt = require('jsonwebtoken');
import { User } from '../models/index';

// For Use in Graphql
const extractJWTMiddleware = () => {
    return (req, res, next) => {
        let authorization = req.headers['authorization']
        let token = authorization ? authorization.split(' ')[1] : undefined

        req['context'] = {}
        req['context']['authorization'] = authorization;

        if (!token) { return next() }

        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) { return next() }

            const user = await User.findByPk(decoded.sub, { attributes: ['id', 'email', 'firebaseUUID'] })

            if (user) {
                req['context']['user'] = {
                    id: user.id,
                    email: user.email,
                    firebaseUUID: user.firebaseUUID
                }
            }

            return next();
        })
    }
}

export { extractJWTMiddleware }
