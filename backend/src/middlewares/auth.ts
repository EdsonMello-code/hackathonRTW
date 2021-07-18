import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';


export default (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).send('error: No token provided ');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return response.status(401).send({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return response.status(401).send({ error: 'Token malformatted' });
  }
  jwt.verify(token, 'lll', function (err, decoded) {
    if (err) return response.status(401).send({ error: 'Token invalid' });

    request.storeId = decoded!.id;
    return next();
  });
};
