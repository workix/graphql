export interface AuthorAttributes {
  id?: number;
  name: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface BlogAttributes {
  id?: number;
  author_id: number;
  category_id?: number;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  picture_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface BlogCommentAttributes {
  id?: number;
  blog_id: number;
  parent_id?: number;
  user_name: string;
  user_email: string;
  comment: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CandidateAttributes {
  id?: number;
  user_id?: number;
  name: string;
  cpf?: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CompanyAttributes {
  id?: number;
  user_id?: number;
  name: string;
  cnpj?: string;
  description?: string;
  logo_url?: string;
  website?: string;
  city?: string;
  state?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface FormAttributes {
  id?: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface JAASUserAttributes {
  id?: number;
  username: string;
  password?: string;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface JAASRoleAttributes {
  id?: number;
  role_name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

import { JobCategory } from './job_categories';

export interface JobAttributes {
  id?: number;
  company_id: number;
  title: string;
  description: string;
  categories?: JobCategory[];
  requirements?: string;
  salary_range?: string;
  location?: string;
  is_featured?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface MemberAttributes {
  id?: number;
  name: string;
  role: string;
  bio?: string;
  photo_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ResumeAttributes {
  id?: number;
  candidate_id: number;
  title: string;
  summary?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface SelectiveProcessAttributes {
  id?: number;
  company_id: number;
  job_id?: number;
  title: string;
  description?: string;
  vacancies?: number;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface SubscriberAttributes {
  id?: number;
  email: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface TestimonialAttributes {
  id?: number;
  author_name: string;
  company_name?: string;
  testimonial: string;
  rating?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password?: string;
  firebase_uid?: string;
  cpf?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
