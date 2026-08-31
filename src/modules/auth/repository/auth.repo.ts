import * as jwt from 'jsonwebtoken';
import { User, Company, Candidate, Resume } from '../../../models';

const authRepository = (db?: any) => {
    const userModel = db?.User || User;
    const companyModel = db?.Company || Company;
    const candidateModel = db?.Candidate || Candidate;
    const resumeModel = db?.Resume || Resume;

    const findByFirebaseUUIDAndEmail = async (firebaseUUID: string, email: string) => {
        return await userModel.findOne({
            where: { firebase_uuid: firebaseUUID, email }
        });
    };

    const getAboutMe = async (firebaseUUID: string, email: string) => {
        const user = await userModel.findOne({
            where: { firebase_uuid: firebaseUUID, email },
            raw: true
        });

        if (!user) {
            return { user: null, company: null, candidate: null, resume: null };
        }

        const company = await companyModel.findOne({ where: { user_id: user.id } });
        const candidate = await candidateModel.findOne({ where: { user_id: user.id } });
        const resume = candidate ? await resumeModel.findOne({ where: { candidate_id: candidate.id } }) : null;

        return { user, company, candidate, resume };
    };

    const generateToken = (user: { firebase_uuid: string; email: string }, expiresIn: number = 900) => {
        const secret = process.env.JWT_SECRET || 'secret';
        return jwt.sign(
            { id: user.firebase_uuid, sub: user.email },
            secret,
            { expiresIn }
        );
    };

    return {
        findByFirebaseUUIDAndEmail,
        getAboutMe,
        generateToken
    };
};

export default authRepository;
