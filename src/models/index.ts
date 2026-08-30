import fs from 'fs';
import path from 'path';
const Sequelize: any = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../config/config.json'))[env];
const db: any = {};

let sequelize: any;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.endsWith('.js') || file.endsWith('.ts')) &&
      !file.endsWith('.d.ts')
    );
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export const Author = db.Author;
export const AuthorMedia = db.AuthorMedia;
export const Blog = db.Blog;
export const BlogCategory = db.BlogCategory;
export const BlogComment = db.BlogComment;
export const BlogPicture = db.BlogPicture;
export const BlogTag = db.BlogTag;
export const Candidate = db.Candidate;
export const Comment = db.Comment;
export const Company = db.Company;
export const CompanyAdmin = db.CompanyAdmin;
export const CompanyFollower = db.CompanyFollower;
export const CompanyMedia = db.CompanyMedia;
export const CompanyPage = db.CompanyPage;
export const Connection = db.Connection;
export const ConnectionRequest = db.ConnectionRequest;
export const DirectMessage = db.DirectMessage;
export const Follow = db.Follow;
export const Form = db.Form;
export const JAASRole = db.JAASRole;
export const JAASRoles = db.JAASRoles;
export const JAASUser = db.JAASUser;
export const Job = db.Job;
export const JobApplication = db.JobApplication;
export const JobCandidate = db.JobCandidate;
export const JobPosting = db.JobPosting;
export const MediaAsset = db.MediaAsset;
export const Member = db.Member;
export const MemberMedia = db.MemberMedia;
export const Notification = db.Notification;
export const Post = db.Post;
export const PostComment = db.PostComment;
export const PostReaction = db.PostReaction;
export const Resume = db.Resume;
export const ResumeEducation = db.ResumeEducation;
export const ResumeExperience = db.ResumeExperience;
export const ResumeSkill = db.ResumeSkill;
export const SelectiveProcess = db.SelectiveProcess;
export const SelectiveProcessCandidate = db.SelectiveProcessCandidate;
export const Subscriber = db.Subscriber;
export const Testimonial = db.Testimonial;
export const User = db.User;
export const UserProfile = db.UserProfile;

export default db;
module.exports = db;
