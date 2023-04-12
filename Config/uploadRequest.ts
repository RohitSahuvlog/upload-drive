import { Request } from "express";

export interface UploadRequest extends Request {
  userId: number;
  files: any[];
  id: number;
  auth: string;
}
