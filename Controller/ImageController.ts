import express, { Response, Request } from 'express';






  export const postImage = (req: Request, res: Response) => {
   return res.status(200).send({message:req});
 }

  export const test = (req: Request, res: Response) => {
    res.send("test");
  }




