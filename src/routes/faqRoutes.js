import express from 'express';
import protect from '../middleware/authMiddleware.js';

import {
    getFAQs,
    updateFAQ,
    addFAQ,
    deleteFAQ,
} from '../controllers/faqController.js';

const router = express.Router();

router.get('/', getFAQs);
router.post('/add', protect, addFAQ);
router.put('/update/:id', protect, updateFAQ);
router.delete('/delete/:id', protect, deleteFAQ);

export default router;
