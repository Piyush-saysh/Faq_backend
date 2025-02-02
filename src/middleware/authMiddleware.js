import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    const tokenString = token.split(' ')[1];
    try {
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
        if (decoded?.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        next();
    } catch (error) {
        next(error);
    }
};
export default protect;
