import express, { Response, Request } from 'express';
import multer from 'multer';



   const upload = multer.diskStorage({
       destination (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) {
        callback(null, './upload/');
    },
    filename (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) {
        callback(null, new Date().valueOf() + '_' + file.originalname);
    }
});

export default upload;