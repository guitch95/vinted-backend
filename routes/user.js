import express from 'express';
import {createUser, loggingUser} from '../controllers/users.js';

const router = express.Router();

router.route('/user/signup').post(createUser);
router.route('/user/login').post(loggingUser);

export default router;
