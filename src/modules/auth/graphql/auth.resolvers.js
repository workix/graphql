import { authResolver } from './../../../composable_resolvers/auth-resolver';
import { compose } from './../../../composable_resolvers/composable.resolver';
import { verifyTokenResolver } from './../../../composable_resolvers/verify-token-resolver';

const authGuard = [authResolver, verifyTokenResolver]


const jwt = require('jsonwebtoken');
import { User, Company, Candidate, Resume } from '../../../models';
import authRepository from "../repository/auth.repo";


const authResolvers = {
    Query: {
        aboutMe: compose(...authGuard)(async (parent, args, ctx, info) => {
            const user = await User.findOne({ where: { firebaseUUID: ctx.user.firebaseUUID, email: ctx.user.email }, raw: true })
            const company = await Company.findOne({ where: { user_id: user.id } })
            const candidate = await Candidate.findOne({ where: { user_id: user.id } })
            const resume = candidate ? await Resume.findOne({where: {candidate_id: candidate.id}}) : null

            return { user, company, candidate, resume }
        })
    },
    Mutation: {
        doLogin: async (parent, args, ctx, info) => {

            const user = await User.findOne({ where: { firebaseUUID: args.input.firebaseUUID, email: args.input.email } })

            if (!user) {
                throw new Error("Email or FirebaseUUID is invalid")
            }

            const expiresIn = 900 // expires in 15min
            const token = jwt.sign({ id: user.firebaseUUID, sub: user.email }, process.env.JWT_SECRET, {
                expiresIn: expiresIn
            });

            return token;

        }
    }
};

export default authResolvers;