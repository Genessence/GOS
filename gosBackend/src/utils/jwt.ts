import jwt from 'jsonwebtoken';

export const generateToken = (payload: object, secret: string, expiresIn: string | number) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};
