import DataLoader from 'dataloader';
import { RequestedFields } from './RequestedFields';

export class AuthorLoader {
    static async batchAuthors(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id'], exclude: [] });

        const authors = await db.Author.findAll({
            where: { id: ids },
            attributes: fields
        });

        const authorsMap = new Map();
        authors.forEach(author => authorsMap.set(author.id, author));

        return ids.map(id => [authorsMap.get(id)]);
    }
}

export class CommentLoader {
    static async batchComments(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id', 'blog_id'], exclude: [] });

        const comments = await db.BlogComment.findAll({
            where: { blog_id: ids },
            attributes: fields
        });

        const commentsMap = new Map();
        comments.forEach(comment => {
            if (!commentsMap.has(comment.blog_id)) {
                commentsMap.set(comment.blog_id, []);
            }
            commentsMap.get(comment.blog_id).push(comment);
        });

        return ids.map(id => commentsMap.get(id) || []);
    }

    static async batchParentsComments(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id'], exclude: [] });

        const comments = await db.BlogComment.findAll({
            where: { id: ids },
            attributes: fields
        });

        const commentsMap = new Map();
        comments.forEach(comment => commentsMap.set(comment.id, comment));

        return ids.map(id => [commentsMap.get(id)]);
    }

    static async batchOwner(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const comments = await db.BlogComment.findAll({
            where: { id: ids },
            attributes: ['id', 'blog_id']
        });

        const commentsMap = new Map();
        comments.forEach(comment => commentsMap.set(comment.id, comment));

        return ids.map(id => [commentsMap.get(id)]);
    }
}

export class MediaLoader {
    static async batchMedias(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id', 'author_id'], exclude: [] });

        const medias = await db.AuthorMedia.findAll({
            where: { author_id: ids },
            attributes: fields
        });

        const mediasMap = new Map();
        medias.forEach(media => {
            if (!mediasMap.has(media.author_id)) {
                mediasMap.set(media.author_id, []);
            }
            mediasMap.get(media.author_id).push(media);
        });

        return ids.map(id => mediasMap.get(id) || []);
    }
}

export class PictureLoader {
    static async batchPictures(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id', 'blog_id'], exclude: [] });

        const pictures = await db.BlogPicture.findAll({
            where: { blog_id: ids },
            attributes: fields
        });

        const picturesMap = new Map();
        pictures.forEach(picture => {
            if (!picturesMap.has(picture.blog_id)) {
                picturesMap.set(picture.blog_id, []);
            }
            picturesMap.get(picture.blog_id).push(picture);
        });

        return ids.map(id => picturesMap.get(id) || []);
    }
}

export class TagLoader {
    static async batchTags(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id', 'blog_id'], exclude: [] });

        const tags = await db.BlogTag.findAll({
            where: { blog_id: ids },
            attributes: fields
        });

        const tagsMap = new Map();
        tags.forEach(tag => {
            if (!tagsMap.has(tag.blog_id)) {
                tagsMap.set(tag.blog_id, []);
            }
            tagsMap.get(tag.blog_id).push(tag);
        });

        return ids.map(id => tagsMap.get(id) || []);
    }
}

export class CategoryLoader {
    static async batchCategories(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id', 'blog_id'], exclude: [] });

        const categories = await db.BlogCategory.findAll({
            where: { blog_id: ids },
            attributes: fields
        });

        const categoriesMap = new Map();
        categories.forEach(category => {
            if (!categoriesMap.has(category.blog_id)) {
                categoriesMap.set(category.blog_id, []);
            }
            categoriesMap.get(category.blog_id).push(category);
        });

        return ids.map(id => categoriesMap.get(id) || []);
    }
}

export class BlogLoader {
    static async batchBlogs(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id'], exclude: [] });

        const blogs = await db.Blog.findAll({
            where: { id: ids },
            attributes: fields
        });

        const blogsMap = new Map();
        blogs.forEach(blog => blogsMap.set(blog.id, blog));

        return ids.map(id => [blogsMap.get(id)]);
    }
}

export class UserLoader {
    static async batchUsers(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id'], exclude: [] });

        const users = await db.User.findAll({
            where: { id: ids },
            attributes: fields
        });

        const usersMap = new Map();
        users.forEach(user => usersMap.set(user.id, user));

        return ids.map(id => [usersMap.get(id)]);
    }
}

export class CompanyMediaLoader {
    static async batchMedias(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id', 'company_id'], exclude: [] });

        const medias = await db.CompanyMedia.findAll({
            where: { company_id: ids },
            attributes: fields
        });

        const mediasMap = new Map();
        medias.forEach(media => {
            if (!mediasMap.has(media.company_id)) {
                mediasMap.set(media.company_id, []);
            }
            mediasMap.get(media.company_id).push(media);
        });

        return ids.map(id => mediasMap.get(id) || []);
    }
}

export class JAASRoleLoader {
    static async batchRoles(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);

        const roles = await db.JAASRoles.findAll({
            where: { id: ids }
        });

        const rolesMap = new Map();
        roles.forEach(role => {
            if (!rolesMap.has(role.id)) {
                rolesMap.set(role.id, []);
            }
            rolesMap.get(role.id).push(role);
        });

        return ids.map(id => rolesMap.get(id) || []);
    }
}

export class CompanyLoader {
    static async batchCompanies(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id'], exclude: [] });

        const companies = await db.Company.findAll({
            where: { id: ids },
            attributes: fields
        });

        const companiesMap = new Map();
        companies.forEach(company => companiesMap.set(company.id, company));

        return ids.map(id => [companiesMap.get(id)]);
    }
}

export class CandidateLoader {
    static async batchCandidates(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);

        const candidates = await db.Candidate.findAll({
            where: { id: ids }
        });

        const candidatesMap = new Map();
        candidates.forEach(candidate => candidatesMap.set(candidate.id, candidate));

        return ids.map(id => [candidatesMap.get(id)]);
    }

    static async batchSubscribers(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);

        const subscribers = await db.JobCandidate.findAll({
            where: { job_id: ids }
        });

        const subscribersMap = new Map();
        subscribers.forEach(sub => {
            if (!subscribersMap.has(sub.job_id)) {
                subscribersMap.set(sub.job_id, []);
            }
            subscribersMap.get(sub.job_id).push(sub);
        });

        return ids.map(id => subscribersMap.get(id) || []);
    }

    static async batchSubscribersSP(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);

        const subscribers = await db.SelectiveProcessCandidate.findAll({
            where: { sp_id: ids }
        });

        const subscribersMap = new Map();
        subscribers.forEach(sub => {
            if (!subscribersMap.has(sub.sp_id)) {
                subscribersMap.set(sub.sp_id, []);
            }
            subscribersMap.get(sub.sp_id).push(sub);
        });

        return ids.map(id => subscribersMap.get(id) || []);
    }
}

export class MemberMediaLoader {
    static async batchMedias(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id', 'member_id'], exclude: [] });

        const medias = await db.MemberMedia.findAll({
            where: { member_id: ids },
            attributes: fields
        });

        const mediasMap = new Map();
        medias.forEach(media => {
            if (!mediasMap.has(media.member_id)) {
                mediasMap.set(media.member_id, []);
            }
            mediasMap.get(media.member_id).push(media);
        });

        return ids.map(id => mediasMap.get(id) || []);
    }
}

export class MemberLoader {
    static async batchMembers(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id'], exclude: [] });

        const members = await db.Member.findAll({
            where: { id: ids },
            attributes: fields
        });

        const membersMap = new Map();
        members.forEach(member => membersMap.set(member.id, member));

        return ids.map(id => [membersMap.get(id)]);
    }
}

export class ResumeLoader {
    static async batchEducations(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);

        const educations = await db.ResumeEducation.findAll({
            where: { id: ids }
        });

        const map = new Map();
        educations.forEach(item => {
            if (!map.has(item.id)) map.set(item.id, []);
            map.get(item.id).push(item);
        });

        return ids.map(id => map.get(id) || []);
    }

    static async batchExperiences(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);

        const experiences = await db.ResumeExperience.findAll({
            where: { id: ids }
        });

        const map = new Map();
        experiences.forEach(item => {
            if (!map.has(item.id)) map.set(item.id, []);
            map.get(item.id).push(item);
        });

        return ids.map(id => map.get(id) || []);
    }

    static async batchSkills(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);

        const skills = await db.ResumeSkill.findAll({
            where: { id: ids }
        });

        const map = new Map();
        skills.forEach(item => {
            if (!map.has(item.id)) map.set(item.id, []);
            map.get(item.id).push(item);
        });

        return ids.map(id => map.get(id) || []);
    }

    static async batchResumes(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);

        const resumes = await db.Resume.findAll({
            where: { id: ids }
        });

        const map = new Map();
        resumes.forEach(resume => map.set(resume.id, resume));

        return ids.map(id => [map.get(id)]);
    }
}

export class JobLoader {
    static async batchJobs(db: any, params: any[], requestedFields: any) {
        const ids = params.map(p => p.key);
        const info = params[0].info;
        const fields = requestedFields.getFields(info, { keep: ['id'], exclude: [] });

        const jobs = await db.Job.findAll({
            where: { id: ids },
            attributes: fields
        });

        const jobsMap = new Map();
        jobs.forEach(job => jobsMap.set(job.id, job));

        return ids.map(id => [jobsMap.get(id)]);
    }
}

export class DataLoaderFactory {
    db: any;
    requestedFields: any;

    constructor(connection: any, requestedFields: any) {
        this.db = connection;
        this.requestedFields = requestedFields;
    }

    getLoaders() {
        const createLoader = (fn: Function) =>
            new DataLoader((params: readonly any[]) => fn(this.db, params, this.requestedFields), {
                cacheKeyFn: (param: any) => param.key
            });

        return {
            mediaLoader: createLoader(MediaLoader.batchMedias),
            authorLoader: createLoader(AuthorLoader.batchAuthors),
            commentsLoader: createLoader(CommentLoader.batchComments),
            commentsParentLoader: createLoader(CommentLoader.batchParentsComments),
            picturesLoader: createLoader(PictureLoader.batchPictures),
            tagsLoader: createLoader(TagLoader.batchTags),
            categoriesLoader: createLoader(CategoryLoader.batchCategories),
            blogsLoader: createLoader(BlogLoader.batchBlogs),
            commentsOwnerLoader: createLoader(CommentLoader.batchOwner),
            usersLoader: createLoader(UserLoader.batchUsers),
            companyMediaLoader: createLoader(CompanyMediaLoader.batchMedias),
            rolesLoader: createLoader(JAASRoleLoader.batchRoles),
            companiesLoader: createLoader(CompanyLoader.batchCompanies),
            candidatesLoader: createLoader(CandidateLoader.batchCandidates),
            candidatesSubscribedJobsLoader: createLoader(CandidateLoader.batchSubscribers),
            memberMediaLoader: createLoader(MemberMediaLoader.batchMedias),
            membersLoader: createLoader(MemberLoader.batchMembers),
            educationsLoader: createLoader(ResumeLoader.batchEducations),
            experiencesLoader: createLoader(ResumeLoader.batchExperiences),
            skillsLoader: createLoader(ResumeLoader.batchSkills),
            jobsLoader: createLoader(JobLoader.batchJobs),
            candidatesSubscribedSPLoader: createLoader(CandidateLoader.batchSubscribersSP),
            resumesLoader: createLoader(ResumeLoader.batchResumes)
        };
    }
}