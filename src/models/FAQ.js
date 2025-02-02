import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
    question: String,
    answer: String,
    translations: {
        hi: { question: String, answer: String },
        en: { question: String, answer: String },
    },
});

export default mongoose.model('FAQ', faqSchema);
