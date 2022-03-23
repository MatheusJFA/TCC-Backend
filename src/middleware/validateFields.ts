import { Request, Response, NextFunction } from "express";

const validate = (schema: any) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    await schema.validate({
      body: request.body,
      query: request.query,
      params: request.params,
      headers: request.headers,
    });
    return next();
  } catch (err) {
    return response.status(500).json({ type: err.name, message: err.message });
  }
};

export default validate;