import { Redis } from 'ioredis';

if (!process.env.REDIS_URL) {
    throw new Error('Redis URL is required');
}

const redis = new Redis(process.env.REDIS_URL, {
    lazyConnect: true,
    family: 4,
});

export default redis;
