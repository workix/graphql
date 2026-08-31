import { authResolver } from './../../../composable_resolvers/auth-resolver';
import { compose } from './../../../composable_resolvers/composable.resolver';
import { verifyTokenResolver } from './../../../composable_resolvers/verify-token-resolver';
import authRepository from "../repository/auth.repo";

const authGuard = [authResolver, verifyTokenResolver];

const authResolvers = {
    Query: {
        aboutMe: compose(...authGuard)(async (parent, args, ctx, info) => {
            const repo = authRepository(ctx?.orm);
            const userContext = ctx?.user;

            if (!userContext?.firebase_uuid || !userContext?.email) {
                throw new Error("Unauthorized! Token payload is invalid");
            }

            return await repo.getAboutMe(userContext.firebase_uuid, userContext.email);
        })
    },
    Mutation: {
        doLogin: async (parent, args, ctx, info) => {
            const repo = authRepository(ctx?.orm);
            const user = await repo.findByFirebaseUUIDAndEmail(args.input.firebaseUUID, args.input.email);

            if (!user) {
                throw new Error("Email or FirebaseUUID is invalid");
            }

            return repo.generateToken(user, 900);
        }
    }
};

export default authResolvers;
