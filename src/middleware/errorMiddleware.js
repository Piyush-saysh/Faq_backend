function errorMiddleware(err, req, res) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
}

export default errorMiddleware;
