import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import UserModel from '../models/user';
import * as dotenv from 'dotenv';
import { AuthRequest } from '../middleware/auth';

//signin

dotenv.config();

//string ? secret 
const JWT_SECRET = process.env.JWT_SECRET as Secret;
//fuck jwt
//login logi




export const signIn: any = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // email le
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid email' });
            return;
        }
        console.log(user?.password)
        console.log(password)

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch)
        if (!isMatch) {
            console.log('here')
            res.status(400).json({ message: 'Invalid password' });
            return;
        }

        // Gen JWT 
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        // change the exp to lowest


        res.json({ token });
        console.log("JWT Token:", token);


    } catch (error) {
        if (error instanceof Error) {
            console.error("Login Error:", error.message);
            res.status(500).json({ message: error.message });
        } else {
            console.error("Unknown Login Error:", error);
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};


export const signUp: any = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user_exist = await UserModel.findOne({ email })

        if (user_exist) {
            return res.status(400).json({ message: "user already exists" })
        }

        const salt = await bcrypt.genSalt(10); // generate salt (10 rounds)
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        const newUser = new UserModel(req.body);

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        res.status(500).json({ message: error })
        console.log("This is signup error")
    }
}


export const profile: any = async (req: AuthRequest, res: Response) => {
    try {
        const _id = req.user._id;

        const user_exist = await UserModel.findById(_id)

        if (!user_exist) {
            res.status(400).json({ message: 'Invalid ID' });
            return;
        }

        res.status(200).json(user_exist)
    } catch (error) {
        res.status(500).json({ message: error })
        console.log("This is a Get profile Error")
    }
}



export const updateprofile: any = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        //current users id
        const _id = req.user._id;
        const userExist = await UserModel.findById(_id);

        if (!userExist) {
            res.status(400).json({ message: 'Invalid ID' });
            return;
        }
        await UserModel.findOneAndUpdate(
            { _id },
            req.body,
            { new: true }
        );
        res.status(200).json({message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('This is an update profile error', error);
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
};