import { Request, Response } from "express";
import RoomModel from "../models/room";

//room mdel = number, type, status, userId

// createRoom(req, res)           // Admin adds a new room
// getAllRooms(req, res)          // List all rooms with user details of occupancy and vanacny
// getRoomById(req, res)          // Fetch specific room
// updateRoomStatusType(req, res)     // Change room status (e.g., to Occupied)
// assignRoomToUser(req, res)     // For live bookings (assign room to user)
// getAvailableRooms(req, res)    // For reservation system
// removeRoom                     // Remove any room from existance

// on create pass {number: 12, type: something, status: 'available'}
export const createRoom: any = async (req: Request, res: Response): Promise<void> => {
    try {
        const { number } = req.body;
        const isRoomavailable = await RoomModel.findOne(number);

        if (isRoomavailable) {
            res.status(200).json('Room Already exists');
            return;
        }

        const newdoc = new RoomModel(req.body);
        await newdoc.save();
        res.status(200).json({ message: 'New Room inserted successfully.' });


    } catch (error) {
        res.status(500).json({ message: error })
        console.log("This is create room Error")
    }
}

export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
    try {
        const rooms = await RoomModel.find()

        res.status(200).json({
            success: true,
            count: rooms.length,
            data: rooms,
        });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch rooms',
            error: (error as Error).message,
        });
    }
};



export const getRoomById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body;

        const data = await RoomModel.findOne({ userId })

        if (!data) {
            res.status(200).json("User is not in Hotel");
            return;
        }

        res.status(500).json(data)

    } catch (error) {
        res.status(500).json({ message: error })
        console.log("This is getroomid Error")
    }
}

// change room status any way any how wtf
export const updateRoomStatusType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { number, status, type, userId } = req.body;
        const room = await RoomModel.findOne({ number, userId });

        if (!room) {
            res.status(200).json('Number and Id dont match');
            return;
        }

        //add try except error for both following 
        if (status) room.status = status;
        if (type) room.type = type;

        await room.save();
        res.status(200).json({
            success: true,
            message: 'Room updated successfully',
            data: room,
        });

    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({
            success: false,
            message: 'This is update room status error',
            error: (error as Error).message,
        });
    }

}



export const assignRoomToUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { number, userId, type } = req.body;
        const room = await RoomModel.findOne({number})
        if (!room) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }

        if (room.status === "Occupied") {
            res.status(404).json({ message: 'Room is already occupied' });
            return;
        }

        room.status = "Occupied";
        room.userId = userId;
        room.type = type;

        await room.save();
        res.status(200).json({ message: 'Room assigned to user successfully', room });

    } catch (error) {
        console.error('Error assigning room:', error);
        res.status(500).json({
            success: false,
            message: 'This is assign room error',
            error: (error as Error).message,
        });
    }
}



// this is query
export const getParticularRoomType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, status } = req.query;

        if (!type && !status) {
            res.status(400).json({ message: 'Please provide either type or status to filter rooms' });
            return;
        }

        const filter: any = {};
        if (type) filter.type = type;
        if (status) filter.status = status;

        const rooms = await RoomModel.find(filter);

        if (rooms.length === 0) {
            res.status(404).json({ message: 'No rooms found for the given criteria' });
            return;
        }

        res.status(200).json({ message: 'Rooms fetched successfully', rooms });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching rooms by type or status',
            error: (error as Error).message,
        });
    }
};

