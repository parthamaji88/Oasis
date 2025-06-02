import mongoose, { Schema, Document } from 'mongoose';

// typescript shii
interface IUser extends Document {
    // userId: string;
    firstName: string;
    lastName: string;
    gender: string;
    phoneNumber: string;
    email: string;
    idproof: string;
    idPicUrl?: string;
    dateOfBirth?: string;
    nationality?: string;
    password: string;

}
// user is singed up to databae irrespective of online or offline then they can be provided with a qr or unique number which can be used to accept the guest


const user: Schema<IUser> = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },

        lastName: {
            type: String,
            required: true,
        },

        gender: {
            type: String,
            required: true,

        },

        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
            //google checkup dal email valid
        },

        idproof: {
            type: String,
            required: true,
            unique: true,
        },

        idPicUrl: {
            type: String,
            required: true,
            unique: true,
        },


        dateOfBirth: {
            type: String,
            required: true,
        },

        nationality: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);


const UserModel = mongoose.model<IUser>('User', user);

export default UserModel;
