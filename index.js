import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.js';
import offerRoutes from './routes/offer.js';
import {v2 as cloudinary} from 'cloudinary';
import 'dotenv/config';

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const app = express();
//CORS permets à notre serveur d'être interrogé par n'importe quel client.
app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI);

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

app.use(userRoutes);
app.use(offerRoutes);

app.get('/', (req, res) => {
  res.status(200).json({message: 'Bienvenue sur mon serveur Vinted'});
});

app.all(/.*/, (req, res) => {
  res.status(404).json({message: 'This route does not exist.'});
});

app.listen(PORT, () => console.log('Server has started'));
