import { Request, Response } from 'express';

export interface UserPayload {
  id: number;
  email: string;
  role?: string;
  firebase_uid?: string;
}

export interface GraphQLContext {
  req: Request;
  res: Response;
  authUser?: UserPayload;
  dataloaders?: any;
  requestedFields?: any;
}
