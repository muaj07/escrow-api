const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../../data/items.json');

router.get('/', (req, res, next) => {
    try {
        const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
        const items = JSON.parse(rawData);
        
        const stats = {
            totalItems: items.length,
            timestamp: new Date().toISOString(),
            source: 'local'
        };
        
        if (items.length > 0 && items[0].category) {
            const categories = {};
            items.forEach(item => {
                categories[item.category] = (categories[item.category] || 0) + 1;
            });
            stats.categories = categories;
        }
        
        res.json({ success: true, stats: stats });
        
    } catch (error) {
        console.error('Error generating stats:', error.message);
        res.json({
            success: true,
            stats: {
                totalItems: 0,
                timestamp: new Date().toISOString(),
                source: 'local',
                note: 'Unable to read local data'
            }
        });
    }
});

module.exports = router;
