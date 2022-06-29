const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { User } from '../../../models';

const usersRepository = db => {
    const requestedFields = new RequestedFields();
    const findAll = async info => {
        const fields = requestedFields.getFields(info, { keep: ["id"], exclude: [] })            
        const sql = `SELECT ${fields.toString()} FROM users ORDER BY id ASC`
        const users = await db.sequelize.query(sql, { type: QueryTypes.SELECT });
        return users;
    }

    return {findAll}
}

export default usersRepository;