const express = require('express');
const { requireAuth } = require('@clerk/express');
const router = express.Router();

router.get('/public', (req, res) => {
    res.json({ message: 'This is a public endpoint.' });
});

router.get('/protected', requireAuth(), (req, res) => {
    const { userId } = req.auth;
    res.json({
        message: 'Milestone B Auth Success: Access granted to protected resource.',
        userId: userId
    });
});

module.exports = router;