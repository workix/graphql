const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { User } from '../../../models';

const usersRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id"], exclude: [] })
    
    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields}
        if (args.start != null && args.max != null){
            options.offset= args.start;
            options.limit=args.max;
        }        
        const users = await User.findAll(options)                
        return users;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const users = await User.findAll({ where: { id: args.id } , attributes: fields})        
        return users[0];
    }

    const createUser = async args => {        
        const user = await User.create(args.input)        
        await user.reload()
        return user;
    }

    const deleteUser = async args => {
        const deleted = await User.destroy({ where: { id: args.id } })        
        return deleted > 0
    }

    return { findAll, findById, createUser, deleteUser }
}

export default usersRepository;