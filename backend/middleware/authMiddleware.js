import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Look for the token in the "Authorization" header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Extract and verify the token using our secret key
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user info to the request object for the next route to use
        req.user = decoded;
        next(); // ✅ Token is valid! Proceed to the actual route handler
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
};

export default authMiddleware;
