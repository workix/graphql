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

class PictureLoader {
    static async batchPictures(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["blog", ""] })
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
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["blog", ""] })
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
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["", ""] })
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


class DLCLoader {
    static async batchDlcs(connection, ids) {
        let idsString = ids.map(v => `'${v}'`).toString();
        let sql = `SELECT * FROM "DLC" WHERE app_id IN (${idsString}) ORDER BY app_id ASC;`;

        let dlcs;

        try {
            dlcs = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        dlcs.forEach(dlc => {
            ordened.set(dlc.app_id, [])
        })

        let id;
        dlcs.forEach(dlc => {
            id = dlc.app_id
            ordened.get(id).push(dlc)
        })

        let response = ids.map(id => ordened.get(id))
        response = response.map(i => i == undefined ? [] : i)
        return Promise.resolve(response);
    }
}

class CommentLoader {
    static async batchComments(connection, params, requestedFields) {
        let ids = params.map(param => param.key)
        let idsString = ids.map(v => `'${v}'`).toString();
        let fields = requestedFields.getFields(params[0].info, { keep: ["id"], exclude: ["blog"] })        
        let sql = `SELECT ${fields.toString()}, c.id as comment_id, bc.Blog_id as blog_id FROM comments c INNER JOIN blogs_comments bc on c.id = bc.comments_id WHERE Blog_id IN (${idsString}) ORDER BY id ASC;`

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
        let sql = `select c.id as comment_id, bc.Blog_id as blog_id from comments c 
        inner join blogs_comments bc on c.id = bc.comments_id WHERE c.id IN (${idsString}) ORDER BY comment_id ASC`

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

export class DataLoaderFactory {
    constructor(connection, requestedFields) {
        this.db = connection;
        this.requestedFields = requestedFields;
    }

    getLoaders() {
        return {
            dlcLoader: new DataLoader(params => {
                return DLCLoader.batchDlcs(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            mediaLoader: new DataLoader(params => {
                return MediaLoader.batchMedias(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            authorLoader: new DataLoader(params => {
                return AuthorLoader.batchAuthors(this.db, params, this.requestedFields)
            }, { cacheKeyFn: param => param.key }),
            commentsLoader: new DataLoader(params => {
                return CommentLoader.batchComments(this.db, params, this.requestedFields)
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
            }, { cacheKeyFn: param => param.key })
        }
    }
}