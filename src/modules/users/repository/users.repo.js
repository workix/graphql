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
        const user = await User.findOne({ where: { id: args.id } , attributes: fields})        
        return user;
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

    const updateUser = async args => {
        const [users, meta] = await User.update(args.input, { where: { id: args.id }, returning: true })
        
        if (meta == 0){
            throw new Error(`User with id: ${args.id} not found`)
        }

        const user = await User.findOne({ where: { id: args.id }})
       
        return user;
    }

    return { findAll, findById, createUser, deleteUser, updateUser }
}

export default usersRepository;