import FAQ from '../models/faq.js';
import redis from '../config/redis.js';
import createTranslations from '../utils/translate.js';

const invalidateFaqCache = async () => {
    try {
        const keys = await redis.keys('faq_*');
        if (keys.length > 0) {
            await redis.del(keys);
        }
    } catch (error) {
        throw new Error('Error invalidating cache:', error);
    }
};
const getFAQs = async (req, res, next) => {
    try {
        const lang = req.query.lang || 'en';
        const cacheKey = `faq_${lang}`;

        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json({ data: JSON.parse(cachedData) });
        }
        const faqs = await FAQ.find();

        const langFaqs = faqs.map((faq) => {
            const translation = faq.translations[lang];
            return {
                id: faq._id.toHexString(),
                question: translation?.question ?? faq.question,
                answer: translation?.answer ?? faq.answer,
                lang: translation ? lang : 'en',
            };
        });
        if (langFaqs.length === 0) {
            return res.status(404).json({ message: 'No FAQs found' });
        }
        const finalLang = langFaqs[0].lang === lang;

        const newCacheKey = finalLang ? cacheKey : `faq_${langFaqs[0].lang}`;

        await redis.set(newCacheKey, JSON.stringify(langFaqs), 'EX', 240);
        res.json({ data: langFaqs });
    } catch (error) {
        next(error);
    }
};

const updateFAQ = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'FAQ id is required' });
        }
        if (!question || !answer) {
            return res
                .status(400)
                .json({ message: 'Both question and answer are required' });
        }
        const updatedFAQ = await FAQ.findByIdAndUpdate(id, {
            question,
            answer,
        });
        if (!updatedFAQ) {
            res.status(404).json({ message: 'FAQ not found' });
        }
        await invalidateFaqCache();
        res.json(updatedFAQ);
    } catch (error) {
        next(error);
    }
};

const addFAQ = async (req, res, next) => {
    try {
        const { question, answer } = req.body;
        if (!question || !answer) {
            return res
                .status(400)
                .json({ message: 'Both question and answer are required' });
        }
        const translations = await createTranslations({ question, answer });
        const newFAQ = new FAQ({
            question,
            answer,
            translations,
        });
        await newFAQ.save();
        await invalidateFaqCache();
    } catch (error) {
        next(error);
    }
};

const deleteFAQ = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedFAQ = await FAQ.findByIdAndDelete(id);
        if (!deletedFAQ) {
            res.status(404).json({ message: 'FAQ not found' });
        }
        await invalidateFaqCache();
        res.json(deletedFAQ);
    } catch (error) {
        next(error);
    }
};

export { getFAQs, updateFAQ, addFAQ, deleteFAQ };
