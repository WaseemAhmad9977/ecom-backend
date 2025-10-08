import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import Exc from "../utill/exc.utill";
import userModel from "./user.model";
import { UserInterface } from "./user.interface";

const FOURTEEN_MINUTE = 840000;
const SIX_DAYS = 518400000;

const getToken = (user: UserInterface) => {
  const payload = {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };

  console.log("check payload " + payload);

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const signup = Exc(async (req: Request, res: Response) => {
  const newUser = new userModel(req.body);
  await newUser.save();
  res.json({ message: "Signup success" });
});

export const login = Exc(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: UserInterface | null = await userModel.findOne({ email });

  if (!user) return res.status(404).send('User not found');

  const isLogin = await bcrypt.compare(password, user.password);
  if (!isLogin) return res.status(401).send('Incorrect password');

  const { refreshToken, accessToken } = getToken(user);

  
  res.setHeader('Set-Cookie', [
    `accessToken=${accessToken}; Path=/; HttpOnly; Secure; SameSite=None; Domain=${process.env.DOMAIN}`,
    `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=None; Domain=${process.env.DOMAIN}`
  ]);

  res.json({ message: 'Login success', role: user.role });
});


export const logout = Exc((req: Request, res: Response) => {
  res.cookie("accessToken", null, {
    maxAge: 0,
    domain: process.env.DOMAIN,
    secure: true,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "dev" ? "lax" : "none",
  });
  res.cookie("refreshToken", null, {
    maxAge: 0,
    domain: process.env.DOMAIN,
    secure: true,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "dev" ? "lax" : "none",
  });
  res.json({ message: "Logout success" });
});

export const session = Exc(
  (req: Request & { user?: UserInterface }, res: Response) => {
    return res.json(req.user || null);
  }
);
