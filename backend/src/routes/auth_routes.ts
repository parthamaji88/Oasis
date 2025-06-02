import mongoose from "mongoose";
import express, { Router } from 'express';
import { signIn, signUp, profile} from "../controllers/user";
import { auth } from '../middleware/auth';

//tf is
const router: Router = express.Router();

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/profile', auth, profile)

//isko auth karke pass karna 
// router.get('/transaction/get', auth, getTransactionhistory)
// router.post('/transaction/insert', auth, insertTransaction)
// router.delete('/transaction/delete', auth, deleteTransaction)
// router.post('/transaction/update', auth, updateTransaction)

export default router