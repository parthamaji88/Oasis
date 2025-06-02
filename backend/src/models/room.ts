import mongoose, { Schema, Document, Types } from 'mongoose';

interface Room extends Document {
  number: number;
  type: 'Single' | 'Double' | 'twin' | 'standard' | 'deluxe' | 'suite';
  status: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance';
  userId?: Types.ObjectId;
}

const RoomSchema: Schema<Room> = new Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['Single' ,'Double' ,'twin' ,'standard' ,'deluxe' ,'suite'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Occupied', 'Maintenance'],
      default: 'Available',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: function (this: Room) {
        return this.status === 'Occupied';
      },
    },
  },
  { timestamps: true }
);

//Pre-save remove userid if status is not Occupied
RoomSchema.pre('save', function (next) {
  if (this.status !== 'Occupied') {
    this.userId = undefined;
  }
  next();
});

const RoomModel = mongoose.model<Room>('Room', RoomSchema);


export default RoomModel;