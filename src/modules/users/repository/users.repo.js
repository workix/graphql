const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { User } from '../../../models';

const usersRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id"], exclude: [] })
    
    const findAll = async info => {
        const fields = getFields(info)
        const users = await User.findAll({ attributes: fields})                
        return users;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const user = await User.findAll({ where: { id: args.id } , attributes: fields})        
        return user[0];
    }

    return { findAll, findById }
}

export default usersRepository;