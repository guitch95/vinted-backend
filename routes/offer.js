import express from 'express';
import {isAuthenticated} from '../middlewares/isAuthenticated.js';
import {
  publishOffer,
  getInfoOffer,
  getInfoByQuery,
} from '../controllers/offers.js';
import fileUpload from 'express-fileupload';

const router = express.Router();

router
  .route('/offer/publish')
  .post(isAuthenticated, fileUpload(), publishOffer);

router.route('/offers').get(getInfoByQuery);

router.route('/offers/:id').get(getInfoOffer);

export default router;
