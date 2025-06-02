import mongoose, { Schema, Document } from 'mongoose';

interface Reservation extends Document {
    userId: string;
    room_type: string;
    start_date: Date;
    end_date: Date;
}


const ReservationSchema: Schema<Reservation> = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },

        room_type: {
            type: String,
            required: true,
        },
        start_date: {
            type: Date,
            required: true,
        },
        end_date: {
            type: Date,
            required: true,
        },

    },
    { timestamps: true }
);


const ReservationModel = mongoose.model<Reservation>('Reservation', ReservationSchema);

export default ReservationModel;
