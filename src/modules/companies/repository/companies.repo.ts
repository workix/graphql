const { QueryTypes, Sequelize } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Company, CompanyMedia } from '../../../models';
import Paginator from '../../../utils/Paginator';
import PaginatedList from '../../../utils/PaginatedList';
import CompanyDTO from '../../../dtos/CompanyDTO';
import { CreateCompanyDTO, UpdateCompanyDTO } from '../../../dtos/CompanyMutationDTO'
import { CreateMediaDTO } from '../../../dtos/MediaMutationDTO';

const companiesRepository = db => {
    const requestedFields = new RequestedFields();
    const virtualFields = ["user", "medias", "locale", "contact", "email", "phone", "industry", "location", "createdAt", "updatedAt"];
    const getFields = info => requestedFields.getFields(info, { keep: ["id", "user_id"], exclude: virtualFields })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["id", "user_id"], exclude: virtualFields })

    const listRandomLogos = async (info, args) => {
        const fields = getFields(info)
        const validColumns = Object.keys(Company.rawAttributes);
        const safeAttributes = fields.filter(f => validColumns.includes(f));
        const options: any = { attributes: safeAttributes.length > 0 ? safeAttributes : undefined, order: [Sequelize.fn('RAND')] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const logos = await Company.findAll(options)
        return logos;
    }

    const findAll = async (info, args) => {
        const fields = getFields(info)
        const validColumns = Object.keys(Company.rawAttributes);
        const safeAttributes = fields.filter(f => validColumns.includes(f));
        const options: any = { attributes: safeAttributes.length > 0 ? safeAttributes : undefined, order: ['id'] }
        if (args.start != null && args.max != null) {
            options.offset = args.start;
            options.limit = args.max;
        }
        const companies = await Company.findAll(options)
        return companies;
    }

    const findById = async (info, args) => {
        const fields = getFields(info)
        const validColumns = Object.keys(Company.rawAttributes);
        const safeAttributes = fields.filter(f => validColumns.includes(f));
        const company = await Company.findOne({ where: { id: args.id }, attributes: safeAttributes.length > 0 ? safeAttributes : undefined })
        return company;
    }

    const create = async (args, ctx?: any) => {
        try {
            const { User } = require('../../../models');
            const inputData = { ...args.input };
            
            if (!inputData.userId && !inputData.user_id) {
                if (ctx?.user?.id) {
                    inputData.userId = ctx.user.id;
                } else if (inputData.email && User && typeof User.findOne === 'function') {
                    const foundUser = await User.findOne({ where: { email: inputData.email } });
                    if (foundUser) {
                        inputData.userId = foundUser.id;
                    }
                }
            }

            const options: any = inputData.medias ? { include: { model: CompanyMedia, as: "medias" } } : {}
            const company = await Company.create(new CreateCompanyDTO(inputData), options)
            await company.reload()

            // Atribui automaticamente o plano Free corporativo para a nova empresa
            try {
                const { Plan, Subscription } = require('../../../models');
                if (Plan && Subscription) {
                    let freePlan = null;
                    if (typeof Plan.findOne === 'function') {
                        freePlan = await Plan.findOne({ where: { code: 'free_v1' } });
                    }

                    const now = new Date();
                    const periodEnd = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());

                    if (typeof Subscription.create === 'function') {
                        await Subscription.create({
                            organization_id: company.id,
                            plan_id: freePlan ? freePlan.id : 1,
                            status: 'active',
                            current_period_start: now,
                            current_period_end: periodEnd,
                            founder_discount_pct: 0.0
                        });
                    }
                }
            } catch (compSubErr) {
                console.warn('[COMPANIES] Aviso ao atribuir plano Free padrão para a nova empresa:', compSubErr);
            }

            return company;
        } catch (error) {
            console.error(error)
            if (error.errors) {
                const errors = error.errors.map(e => e.message)
                throw new Error(errors.toString())
            } else {
                throw new Error(error.message)
            }

        }

    }

    const destroy = async args => {
        const deleted = await Company.destroy({ where: { id: args.id } })
        return deleted > 0
    }

    const update = async args => {
        const c = await Company.findByPk(args.id, { attributes: ["id"], raw: true })

        if (!c) {
            throw new Error(`Company with id: ${args.id} not found`)
        }

        await db.sequelize.transaction(async transaction => {
            // chain all your queries here. make sure you return them.
            const [companies, meta] = await Company.update(new UpdateCompanyDTO(args.input), { where: { id: args.id }, returning: true, individualHooks: true }, { transaction })

            if (args.input.medias) {
                for (const m of args.input.medias) {
                    await CompanyMedia.destroy({ where: { id: args.id } }, { transaction })
                    const mediaInput = { id: args.id, media: m.media, url: m.url }
                    await CompanyMedia.create(new CreateMediaDTO(mediaInput), { transaction })
                }
            }
        })

        const company = await Company.findOne({ where: { id: args.id }, include: { model: CompanyMedia, as: "medias" } })

        return company;
    }

    const findAllPaginated = async (info, args) => {

        const fields = getFieldsWithSubfields(info).get("companies") || []
        const validColumns = Object.keys(Company.rawAttributes);
        const safeAttributes = fields.filter(f => validColumns.includes(f));
        if (safeAttributes.length > 0) {
            if (!safeAttributes.includes("id")) safeAttributes.push("id");
            if (!safeAttributes.includes("user_id")) safeAttributes.push("user_id");
        }

        const totalRows = await Company.count()

        const paginator = new Paginator(args.limit, args.page, totalRows);

        const totalPages = paginator.getTotalPages();

        const start = paginator.getStart();

        const end = paginator.getEnd();

        const options: any = { attributes: safeAttributes.length > 0 ? safeAttributes : undefined, order: ['id'] }
        options.offset = start - 1;
        options.limit = args.limit;

        let companies = await Company.findAll(options)
        companies = companies.map(c => new CompanyDTO(c))

        const paginatedList = new PaginatedList('companies', companies, start, end, totalPages, paginator.getCurrentPage(), paginator.getLimitRows(), paginator.getMaxRows())
        return paginatedList;
    }

    return { findAll, findById, create, destroy, update, findAllPaginated, listRandomLogos }
}

export default companiesRepository;
