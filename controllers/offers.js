import {convertToBase64} from '../utils/convertToBase64.js';
import {v2 as cloudinary} from 'cloudinary';
import mongoose from 'mongoose';
import Offer from '../models/Offer.js';

export const publishOffer = async (req, res, next) => {
  try {
    console.log('Body', req.body);
    console.log('Files', req.files);

    const {title, description, price, condition, city, brand, size, color} =
      req.body;

    const cloudinaryResponse = await cloudinary.uploader.upload(
      convertToBase64(req.files.picture)
    );

    const newOffer = new Offer({
      product_name: title,
      product_price: price,
      product_description: description,
      product_details: [
        {MARQUE: brand},
        {TAILLE: size},
        {ÉTAT: condition},
        {COULEUR: color},
        {EMPLACEMENT: city},
      ],
      product_image: cloudinaryResponse,
      owner: req.user._id,
    });

    await newOffer.save();
    await newOffer.populate('owner', 'account');
    // Renvois moi uniquement l'account dans l'owner
    res.status(200).json(newOffer);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export const getInfoByQuery = async (req, res, next) => {
  try {
    const {title, priceMax, priceMin, sort, page = 1} = req.query;
    const filters = {};

    if (title) {
      filters.product_name = new RegExp(title, 'i');
    }

    if (priceMax || priceMin) {
      filters.product_price = {};
      if (priceMax) {
        filters.product_price.$lte = Number(priceMax);
      }
      if (priceMin) {
        filters.product_price.$gte = Number(priceMin);
      }
    }

    const sortFilter = {};

    if (sort === 'price-asc') {
      sortFilter.product_price === 'ascending';
    } else if (sort === 'price-desc') {
      sortFilter.product_price === 'descending';
    }

    const limit = 5;
    const skip = (page - 1) * limit;

    const offers = await Offer.find(filters)
      .populate('owner', 'account')
      .sort(sortFilter)
      .skip(skip)
      .limit(limit);

    const count = await Offer.countDocuments(filters);

    res.status(200).json({count: count, offers: offers});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export const getInfoOffer = async (req, res, next) => {
  try {
    const {id} = req.params;

    const findOffer = await Offer.findById(id);

    await findOffer.populate('owner', 'account');

    res.status(200).json(findOffer);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
