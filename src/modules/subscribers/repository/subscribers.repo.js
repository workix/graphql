const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Subscriber } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';
import SubscriberDTO from '../../../dtos/SubscriberDTO';
import { CreateSubscriberDTO, UpdateSubscriberDTO } from '../../../dtos/SubscriberMutationDTO';

const subscribersRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: [], exclude: [] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: [], exclude: [] })

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const options = { attributes: fields, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const subscribers = await Subscriber.findAll(options)
        return subscribers;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const subscriber = await Subscriber.findOne({ where: { id: args.id }, attributes: fields })
        return subscriber;
    }

    const create = async args => {
        const subscriber = await Subscriber.create(new CreateSubscriberDTO(args.input))
        await subscriber.reload()
        return subscriber;
    }

    const destroy = async args => {
        const deleted = await Subscriber.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const f = await Subscriber.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!f) {
            throw new Error(`Subscriber with id: ${args.id} not found`)
        }

        const [subscribers, meta] = await Subscriber.update(new UpdateSubscriberDTO(args.input), { where: { id: args.id }, returning: true, individualHooks: true})

        const subscriber = await Subscriber.findOne({ where: { id: args.id } })

        return subscriber;
    }

    const findAllPaginated = async (info, args) => {

        const fields = getFieldsWithSubfields(info).get("subscribers")

        const totalRows = await Subscriber.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

        const start = paginator.getStart();

        const end = paginator.getEnd();

        const options = { attributes: fields, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        let subscribers = await Subscriber.findAll(options)
        subscribers = subscribers.map(s => new SubscriberDTO(s))

        const paginatedList = new PaginatedList('subscribers', subscribers, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    const subscribeToggle = async args => {
        const subscriber = await Subscriber.findOne({ email: args.email })
        if (!subscriber) {
            await Subscriber.create({ email: args.email })
            return true
        } else {
            await subscriber.destroy()
            return false
        }
    }

    return { findAll, findById, create, destroy, update, findAllPaginated, subscribeToggle }
}

export default subscribersRepository;