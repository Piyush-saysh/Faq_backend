import { describe, beforeAll, afterAll, test, expect } from 'vitest';
import request from 'supertest';
import connectDB from '../src/config/db.js';
import FAQ from '../src/models/faq.js';
import mongoose from 'mongoose';
import app from '../src/app.js';

const insertedFaqIds = [];

beforeAll(async () => {
    await connectDB();

    const insertedDocs = await FAQ.insertMany([
        {
            question: 'What is the capital of France?',
            answer: 'Paris',
            translations: {
                hi: { question: 'फ्रांस की राजधानी क्या है?', answer: 'पेरिस' },
            },
        },
    ]);

    insertedFaqIds.push(...insertedDocs.map((doc) => doc._id));
});

afterAll(async () => {
    await FAQ.deleteMany({ _id: { $in: insertedFaqIds } });
    await mongoose.connection.close();
});

describe('GET /api/faqs', () => {
    test('should return all FAQs', async () => {
        const response = await request(app).get('/api/faqs');

        expect(response.status).toBe(200);
        const { data } = response.body;

        expect(data).toBeDefined();
        expect(Array.isArray(data) && data.length > 0).toBe(true);
        expect(data[0]).toHaveProperty('question');
    });

    test('should return FAQs in Hindi', async () => {
        const response = await request(app)
            .get('/api/faqs')
            .query({ lang: 'hi' });

        const { data } = response.body;

        expect(data).toBeDefined();
        expect(Array.isArray(data) && data.length > 0).toBe(true);
        expect(data[0]).toHaveProperty('question');
    });

    test('should fallback to English for non-existent language', async () => {
        const response = await request(app)
            .get('/api/faqs')
            .query({ lang: 'xx' });
        const { data } = response.body;

        expect(Array.isArray(data) && data.length > 0).toBe(true);
        expect(data[0]).toHaveProperty('question');
    });
});
