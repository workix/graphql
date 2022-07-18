import DataLoader from "dataloader"
const { QueryTypes } = require('sequelize');

class AuthorLoader {
    static async batchAuthors(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["medias"] })
        let sql = `SELECT ${fields.toString()} FROM authors WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let authors;

        try {
            authors = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        authors.forEach(author => {
            ordened.set(author.id, [])
        })

        let id;
        authors.forEach(author => {
            id = author.id
            ordened.get(id).push(author)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class MemberLoader {
    static async batchMembers(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: [] })
        let sql = `SELECT ${fields.toString()} FROM members WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let members;

        try {
            members = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        members.forEach(member => {
            ordened.set(member.id, [])
        })

        let id;
        members.forEach(member => {
            id = member.id
            ordened.get(id).push(member)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class UserLoader {
    static async batchUsers(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: [] })
        let sql = `SELECT ${fields.toString()} FROM users WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let users;

        try {
            users = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        users.forEach(user => {
            ordened.set(user.id, [])
        })

        let id;
        users.forEach(user => {
            id = user.id
            ordened.get(id).push(user)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}


class MediaLoader {
    static async batchMedias(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["author"] })
        let sql = `SELECT ${fields.toString()} FROM authors_medias WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let medias;

        try {
            medias = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        medias.forEach(media => {
            ordened.set(media.id, [])
        })

        let id;
        medias.forEach(media => {
            id = media.id
            ordened.get(id).push(media)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class MemberMediaLoader {
    static async batchMedias(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["owner"] })
        let sql = `SELECT ${fields.toString()} FROM members_medias WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let medias;

        try {
            medias = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        medias.forEach(media => {
            ordened.set(media.id, [])
        })

        let id;
        medias.forEach(media => {
            id = media.id
            ordened.get(id).push(media)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class CompanyMediaLoader {
    static async batchMedias(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: [] })
        let sql = `SELECT ${fields.toString()} FROM companies_medias WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let medias;

        try {
            medias = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        medias.forEach(media => {
            ordened.set(media.id, [])
        })

        let id;
        medias.forEach(media => {
            id = media.id
            ordened.get(id).push(media)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class PictureLoader {
    static async batchPictures(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["blog"] })
        let sql = `SELECT ${fields.toString()} FROM blogs_pictures WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let pictures;

        try {
            pictures = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        pictures.forEach(picture => {
            ordened.set(picture.id, [])
        })

        let id;
        pictures.forEach(picture => {
            id = picture.id
            ordened.get(id).push(picture)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class TagLoader {
    static async batchTags(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["blog"] })
        let sql = `SELECT ${fields.toString()} FROM blogs_tags WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let tags;

        try {
            tags = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }

        const ordened = new Map()

        tags.forEach(tag => {
            ordened.set(tag.id, [])
        })

        let id;
        tags.forEach(tag => {
            id = tag.id
            ordened.get(id).push(tag)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class BlogLoader {
    static async batchBlogs(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: [] })
        let sql = `SELECT ${fields.toString()} FROM blogs WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let blogs;

        try {
            blogs = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }

        const ordened = new Map()

        blogs.forEach(blog => {
            ordened.set(blog.id, [])
        })

        let id;
        blogs.forEach(blog => {
            id = blog.id
            ordened.get(id).push(blog)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class CompanyLoader {
    static async batchCompanies(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["medias"] })
        let sql = `SELECT ${fields.toString()} FROM companies WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let companies;

        try {
            companies = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }

        const ordened = new Map()

        companies.forEach(company => {
            ordened.set(company.id, [])
        })

        let id;
        companies.forEach(company => {
            id = company.id
            ordened.get(id).push(company)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class JobLoader {
    static async batchJobs(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id", "company_id"], exclude: ["company"] })
        let sql = `SELECT ${fields.toString()} FROM jobs WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let jobs;

        try {
            jobs = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }

        const ordened = new Map()

        jobs.forEach(jobs => {
            ordened.set(jobs.id, [])
        })

        let id;
        jobs.forEach(job => {
            id = job.id
            ordened.get(id).push(job)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class CandidateLoader {
    static async batchCandidates(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id", "user_id"], exclude: ["user","resume"] })
        let sql = `SELECT ${fields.toString()} FROM candidates WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let candidates;

        try {
            candidates = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }

        const ordened = new Map()

        candidates.forEach(candidate => {
            ordened.set(candidate.id, [])
        })

        let id;
        candidates.forEach(candidate => {
            id = candidate.id
            ordened.get(id).push(candidate)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }

    static async batchSubscribers(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();        
        
        let sql = `SELECT Job_id as job_id, candidates_id as candidate_id FROM jobs_candidates WHERE Job_id IN (${idsString}) ORDER BY Job_id ASC;`;

        let candidates;

        try {
            candidates = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }

        const ordened = new Map()

        candidates.forEach(candidate => {
            ordened.set(candidate.job_id, [])
        })

        let id;
        candidates.forEach(candidate => {
            id = candidate.job_id
            ordened.get(id).push(candidate)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }

    static async batchSubscribersSP(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();        
        
        let sql = `SELECT sp_id, candidate_id FROM selective_processes_candidates WHERE sp_id IN (${idsString}) ORDER BY sp_id ASC;`;

        let candidates;

        try {
            candidates = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }

        const ordened = new Map()

        candidates.forEach(candidate => {
            ordened.set(candidate.sp_id, [])
        })

        let id;
        candidates.forEach(candidate => {
            id = candidate.sp_id
            ordened.get(id).push(candidate)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}



class JAASRoleLoader {
    static async batchRoles(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["name"] })
        let sql = `SELECT ${fields.toString()}, role_name FROM JAAS_Roles WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let roles;

        try {
            roles = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        roles.forEach(role => {
            ordened.set(role.id, [])
        })

        let id;
        roles.forEach(role => {
            id = role.id
            ordened.get(id).push(role)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class CommentLoader {
    static async batchParentsComments(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id", "parent_id"], exclude: ["parent_comment"] })        
        let sql = `SELECT ${fields.toString()} FROM comments WHERE parent_id IN (${idsString}) ORDER BY id ASC;`

        let comments;

        try {
            comments = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        comments.forEach(comment => {
            ordened.set(comment.parent_id, [])
        })

        let id;
        comments.forEach(comment => {
            id = comment.parent_id
            ordened.get(id).push(comment)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)       
        
        return Promise.resolve(response);
    }

    static async batchComments(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["blog"] })        
        let sql = `SELECT ${fields.toString()}, c.id as comment_id, bc.blog_id as blog_id FROM comments c INNER JOIN blogs_comments bc on c.id = bc.comment_id WHERE blog_id IN (${idsString}) ORDER BY id ASC;`

        let comments;

        try {
            comments = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        comments.forEach(comment => {
            ordened.set(comment.blog_id, [])
        })

        let id;
        comments.forEach(comment => {
            id = comment.blog_id
            ordened.get(id).push(comment)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }

    static async batchOwner(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        // let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["blog"] })        
        // let sql = `SELECT ${fields.toString()}, c.id as comment_id, bc.Blog_id as blog_id FROM comments c INNER JOIN blogs_comments bc on c.id = bc.comments_id WHERE Blog_id IN (${idsString}) ORDER BY id ASC;`
        let sql = `select c.id as comment_id, bc.blog_id as blog_id from comments c 
        inner join blogs_comments bc on c.id = bc.comment_id WHERE c.id IN (${idsString}) ORDER BY comment_id ASC`

        let owners;

        try {
            owners = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        owners.forEach(owner => {
            ordened.set(owner.comment_id, [])
        })

        let id;
        owners.forEach(owner => {
            id = owner.comment_id
            ordened.get(id).push(owner)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class ResumeLoader {
    static async batchResumes(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id", "candidate_id"], exclude: ["educations", "experiences", "skills"] })
        let sql = `SELECT ${fields.toString()} FROM resumes WHERE candidate_id IN (${idsString}) ORDER BY id ASC;`;

        let resumes;

        try {
            resumes = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }

        const ordened = new Map()

        resumes.forEach(resume => {
            ordened.set(resume.candidate_id, [])
        })

        let id;
        resumes.forEach(resume => {
            id = resume.candidate_id
            ordened.get(id).push(resume)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }

    static async batchEducations(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: [] })
        let sql = `SELECT ${fields.toString()} FROM resumes_educations WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let educations;

        try {
            educations = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }

        const ordened = new Map()

        educations.forEach(education => {
            ordened.set(education.id, [])
        })

        let id;
        educations.forEach(education => {
            id = education.id
            ordened.get(id).push(education)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }

    static async batchExperiences(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: [] })
        let sql = `SELECT ${fields.toString()} FROM resumes_experiences WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let experiences;

        try {
            experiences = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }

        const ordened = new Map()

        experiences.forEach(experience => {
            ordened.set(experience.id, [])
        })

        let id;
        experiences.forEach(experience => {
            id = experience.id
            ordened.get(id).push(experience)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }

    static async batchSkills(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: [] })
        let sql = `SELECT ${fields.toString()} FROM resumes_skills WHERE id IN (${idsString}) ORDER BY id ASC;`;

        let skills;

        try {
            skills = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }

        const ordened = new Map()

        skills.forEach(skill => {
            ordened.set(skill.id, [])
        })

        let id;
        skills.forEach(skill => {
            id = skill.id
            ordened.get(id).push(skill)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

export class DataLoaderFactory {
    constructor(connection, requestedFields) {
        this.db = connection;
        this.requestedFields = requestedFields;
    }

    getLoaders() {
        return {            
            mediaLoader: new DataLoader(params => {
                return MediaLoader.batchMedias(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            authorLoader: new DataLoader(params => {
                return AuthorLoader.batchAuthors(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            commentsLoader: new DataLoader(params => {
                return CommentLoader.batchComments(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            commentsParentLoader: new DataLoader(params => {
                return CommentLoader.batchParentsComments(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            picturesLoader: new DataLoader(params => {
                return PictureLoader.batchPictures(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            tagsLoader: new DataLoader(params => {
                return TagLoader.batchTags(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            blogsLoader: new DataLoader(params => {
                return BlogLoader.batchBlogs(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            commentsOwnerLoader: new DataLoader(params => {
                return CommentLoader.batchOwner(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            usersLoader: new DataLoader(params => {
                return UserLoader.batchUsers(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            companyMediaLoader: new DataLoader(params => {
                return CompanyMediaLoader.batchMedias(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            rolesLoader: new DataLoader(params => {
                return JAASRoleLoader.batchRoles(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            companiesLoader: new DataLoader(params => {
                return CompanyLoader.batchCompanies(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            candidatesLoader: new DataLoader(params => {
                return CandidateLoader.batchCandidates(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            candidatesSubscribedJobsLoader: new DataLoader(params => {
                return CandidateLoader.batchSubscribers(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            memberMediaLoader: new DataLoader(params => {
                return MemberMediaLoader.batchMedias(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            membersLoader: new DataLoader(params => {
                return MemberLoader.batchMembers(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            educationsLoader: new DataLoader(params => {
                return ResumeLoader.batchEducations(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            experiencesLoader: new DataLoader(params => {
                return ResumeLoader.batchExperiences(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            skillsLoader: new DataLoader(params => {
                return ResumeLoader.batchSkills(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            jobsLoader: new DataLoader(params => {
                return JobLoader.batchJobs(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            candidatesSubscribedSPLoader: new DataLoader(params => {
                return CandidateLoader.batchSubscribersSP(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            resumesLoader: new DataLoader(params => {
                return ResumeLoader.batchResumes(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
        }
    }
}