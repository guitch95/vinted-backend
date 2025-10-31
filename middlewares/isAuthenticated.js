import mongoose from 'mongoose';
import User from '../models/User.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    console.log(req.headers.authorization);
    if (!req.headers.authorization) {
      return res.status(401).json({message: 'Unauthorized'});
    }
    const token = req.headers.authorization.replace('Bearer ', '');

    // Tu m'envoies les infos sauf le hash et le salt avec select(-valeur que l'on veut exclure)
    const user = await User.findOne({token}).select('-hash -salt');
    if (!user) {
      return res.status(401).json({message: 'Unauthorized'});
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
