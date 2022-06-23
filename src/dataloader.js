import DataLoader from "dataloader"
const { QueryTypes } = require('sequelize');

class MediaLoader {
    static async batchDlcs(connection, ids) {
        let idsString = ids.map(v => `'${v}'`).toString();
        let sql = `SELECT * FROM authors_medias WHERE id IN (${idsString}) ORDER BY id ASC;`;        
        
        let medias;

        try {
            medias = await connection.sequelize.query(sql, { type: QueryTypes.SELECT });       
        } catch (error) {
            console.error(error);
        }


        const ordened = new Map()

        medias.forEach(media=>{
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

        dlcs.forEach(dlc=>{
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

export class DataLoaderFactory {
    constructor(connection) {
        this.db = connection;
    }

    getLoaders() {
        return {
            dlcLoader: new DataLoader(ids => {
                return DLCLoader.batchDlcs(this.db, ids)
            }),
            mediaLoader: new DataLoader(ids => {
                return MediaLoader.batchDlcs(this.db, ids)
            })
        }
    }
}