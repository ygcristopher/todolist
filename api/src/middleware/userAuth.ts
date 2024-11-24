import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

const access_token_secret: string | undefined = process.env.ACCESS_TOKEN_SECRET;

interface TokenPayload {
  email: string;
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

const UserAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      err: "Authentication token not provided",
    });
  }

  try {
    const decoded = jwt.verify(token, access_token_secret || "") as TokenPayload;
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({
      err: "Invalid or expired authentication token",
    });
  }
};

export default UserAuth;