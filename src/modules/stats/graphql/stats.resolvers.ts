import statsRepository from "../repository/stats.repo";

const statsResolvers = {
    Query: {
        statisticsCount: (parent, args, ctx, info) => {
            const stats = statsRepository(ctx.orm).statisticsCount(info, args)
            return stats;
        }
    },
    Mutation: {

    }
}

export default statsResolvers;
