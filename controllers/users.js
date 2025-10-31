import uid2 from 'uid2';
import mongoose from 'mongoose';
import User from '../models/User.js';
import SHA256 from 'crypto-js/sha256.js';
import encBase64 from 'crypto-js/enc-base64.js';

export const createUser = async (req, res, next) => {
  try {
    const {username, email, newsletter, password} = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({message: 'Missing parameters'});
    }

    const findUser = await User.findOne({email});
    if (findUser) {
      return res.status(409).json({message: 'This user already exists.'});
    }

    const salt = uid2(16);
    const passwordSalt = password + salt;
    const hash = SHA256(passwordSalt).toString(encBase64);
    const token = uid2(64);

    const newUser = new User({
      email,
      account: {
        username,
      },
      newsletter,
      token,
      hash,
      salt,
    });

    await newUser.save();

    res.status(201).json({
      token: newUser.token,
      _id: newUser._id,
      account: newUser.account,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const loggingUser = async (req, res, next) => {
  try {
    const {password, email} = req.body;
    const findUser = await User.findOne({email});

    if (!findUser) {
      return res.status(401).json({message: 'Unauthorized'});
    }

    const newHash = SHA256(password + findUser.salt).toString(encBase64);

    if (newHash === findUser.hash) {
      res
        .status(200)
        .json({
          _id: findUser._id,
          token: findUser.token,
          account: {username: findUser.account.username},
        });
    } else {
      res.status(401).json({message: 'Unauthorized'});
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
