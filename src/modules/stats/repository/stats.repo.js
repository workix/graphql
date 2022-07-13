const { QueryTypes } = require('sequelize');
import { RequestedFields } from '../../../RequestedFields';
import { Job, Company, Candidate, Resume } from '../../../models';

const statsRepository = db => {
    const requestedFields = new RequestedFields();
    const getFields = info => requestedFields.getFields(info, { keep: ["id"], exclude: [] })
    const getFieldsWithSubfields = info => requestedFields.getFieldsWithSubfields(info, { keep: ["id"], exclude: [] })

   const statisticsCount = async (info, args) => {
    const members = await Candidate.count()
    const jobs = await Job.count()
    const resumes = await Resume.count()
    const companies = await Company.count()

    return {
        members,
        jobs,
        resumes,
        companies
    }
   }

    return { statisticsCount }
}

export default statsRepository;