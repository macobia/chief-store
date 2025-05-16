// import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
import { redis } from '../lib/redis.js';
import { transport } from "../lib/nodemailer.js";
import crypto from 'crypto'

dotenv.config();


const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_ACCESS_TOKEN, {
    expiresIn: "90m",
  })

  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: "7d",

  })
  return { accessToken, refreshToken }
}

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refreshToken:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
}

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevent xss attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",  //prevent CSRF attacks
    maxAge: 90 * 60 * 1000,  // 90 minutes
  })
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //prevent xss attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",  //prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
  })
}


export const signup = async (req, res) => {


  const { name, email, password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({
      error: {
        message: "Password must be at least 6 characters long",
      },
    });
  }


  const user = await User.findOne({ email: email });
  if (user == null) {
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await User.create({
      name,
      password: hashedPassword,
      email,
    });
    console.log(newUser);

    //authenticate user
    const { accessToken, refreshToken } = generateToken(newUser._id);
    await storeRefreshToken(newUser._id, refreshToken);

    setCookies(res, accessToken, refreshToken);


    if (newUser) {
      res.status(201).json({
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,

        },
        message: "User was created successfully",
      });
    } else {
      res.status(500).json({
        error: {
          message: "Server error while creating user",
        },
      });
    }
  } else {

    res.status(400).json({
      error: {
        message: "User already exist",
      },
    });
  }
}

export const login = async (req, res) => {

  const { password, email } = req.body

 

  const user = await User.findOne({ email: email }).select('+password');

    try {
      if (!user) {
        return res.status(404).json({
          error: {
            message: "User not found",
          },
        });
      } 

      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);
        res.status(200).json({
          user:
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          message: "User logged in successfully",
          accessToken,
        });
      } else {

        res.status(401).json({

          error: {
            message: "invalid credentials",
          },
        })

      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: {
          message: "Server error while logging in",
        },
      })
    }


  }


export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN);
      await redis.del(`refreshToken:${decoded.userId}`)
   
    }

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.json({ message: "Logged Out successfully from your account" })
  } catch (error) {
    res.status(500).json({
      error: {
        message: "Server error while logging out",
      },
    })

  }
}

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorized, No refresh Token provided",
      })
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN);
    const storedToken = await redis.get(`refreshToken:${decoded.userId}`);
    if (storedToken !== refreshToken) {
      return res.status(401).json({
        message: "Unauthorized, Invalid refresh Token provided",
      })

    }
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET_ACCESS_TOKEN, {
      expiresIn: "90m",
    })
    res.cookie("accessToken", accessToken, {
      httpOnly: true, //prevent xss attacks
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",  //prevent CSRF attacks
      maxAge: 90 * 60 * 1000,  // 90 minutes
    })
    res.json({ message: "Token refreshed successfully", })
  } catch (error) {
    console.error("Error while refreshing token", error);
    res.status(500).json({
      error: {
        message: "Server Error while refreshing token "
      }
    })
  }

}

export const forgotPassword = async (req, res) => {
  const {email} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user) {return res.status(404).json({message: "User not found"});}
    
    const token = crypto.randomBytes(32).toString("hex");
    const expire = Date.now() + 3600000; // 1 hour
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expire;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await transport.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `
     <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    <div style="background-color: #059669; padding: 20px; color: white; text-align: center;">
      <h2 style="margin: 0;">Chief-Store</h2>
    </div>
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #333;">You requested for a password reset.</p>
      <p style="font-size: 16px; color: #333;">
        Click the button below to reset your password. This link will expire in an hour.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 16px;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 14px; color: #666;">If you didn’t request this, you can safely ignore this email.</p>
      <p style="font-size: 14px; color: #666;">– The Chief-Store Team</p>
    </div>
    <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #888;">
      © ${new Date().getFullYear()} Chief-Store. All rights reserved.
    </div>
  </div>
      `,
    });
    res.json({message: "Password reset link sent to your email"});
    
  } catch (error) {
    console.log("Error in forgotPassword controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const resetPassword = async (req, res) => {
  const {token} = req.params;
  const {password} = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {$gt: Date.now()
      }});
    if(!user) {
      return res.status(400).json({message: "Invalid or expired token"})
    };
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({message: "Password reset successfully"});
  } catch (error) {
    console.log("Error in resetPassword controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Error in getProfile controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
// a@gmail.com
// 123456

