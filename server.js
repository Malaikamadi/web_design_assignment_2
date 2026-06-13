// ============================================
// Salone FarmHub — Express API Server
// ============================================
// Serves the static frontend and provides
// REST API endpoints backed by PostgreSQL.
// ============================================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { query } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// ============================================
// API ROUTES
// ============================================

// ------------------------------------------
// CROPS
// ------------------------------------------

// GET /api/crops — List all crops
app.get('/api/crops', async (req, res) => {
    try {
        const result = await query(
            'SELECT id, name, category, description, season FROM crops ORDER BY name'
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching crops:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch crops' });
    }
});

// ------------------------------------------
// MARKET PRICES
// ------------------------------------------

// GET /api/market-prices — Get current market prices
app.get('/api/market-prices', async (req, res) => {
    try {
        const { crop, market } = req.query;

        let sql = `
            SELECT
                mp.id,
                c.name AS crop_name,
                c.category AS crop_category,
                mp.market_name,
                mp.price,
                mp.unit,
                mp.currency,
                mp.price_date,
                mp.source
            FROM market_prices mp
            JOIN crops c ON mp.crop_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (crop) {
            params.push(crop);
            sql += ` AND c.name ILIKE $${params.length}`;
        }
        if (market) {
            params.push(`%${market}%`);
            sql += ` AND mp.market_name ILIKE $${params.length}`;
        }

        sql += ' ORDER BY c.name, mp.market_name';

        const result = await query(sql, params);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching market prices:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch market prices' });
    }
});

// ------------------------------------------
// FARMERS
// ------------------------------------------

// GET /api/farmers — List all farmers
app.get('/api/farmers', async (req, res) => {
    try {
        const result = await query(
            `SELECT id, first_name, last_name, phone, district, chiefdom, village, 
                    farm_size_acres, status, created_at 
             FROM farmers ORDER BY created_at DESC`
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching farmers:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch farmers' });
    }
});

// POST /api/farmers/register — Register a new farmer
app.post('/api/farmers/register', async (req, res) => {
    try {
        const { first_name, last_name, email, phone, district, chiefdom, village, farm_size_acres } = req.body;

        // Validation
        if (!first_name || !last_name || !phone || !district) {
            return res.status(400).json({
                success: false,
                error: 'First name, last name, phone, and district are required.'
            });
        }

        const result = await query(
            `INSERT INTO farmers (first_name, last_name, email, phone, district, chiefdom, village, farm_size_acres)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id, first_name, last_name, phone, district, status, created_at`,
            [first_name, last_name, email || null, phone, district, chiefdom || null, village || null, farm_size_acres || null]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        // Handle unique constraint violation (duplicate phone/email)
        if (err.code === '23505') {
            const field = err.constraint.includes('phone') ? 'phone number' : 'email';
            return res.status(409).json({
                success: false,
                error: `A farmer with this ${field} is already registered.`
            });
        }
        console.error('Error registering farmer:', err);
        res.status(500).json({ success: false, error: 'Failed to register farmer' });
    }
});

// ------------------------------------------
// BUYERS
// ------------------------------------------

// GET /api/buyers — List all buyers
app.get('/api/buyers', async (req, res) => {
    try {
        const result = await query(
            `SELECT id, business_name, contact_person, phone, location, buyer_type, status, created_at
             FROM buyers ORDER BY created_at DESC`
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching buyers:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch buyers' });
    }
});

// POST /api/buyers/register — Register a new buyer
app.post('/api/buyers/register', async (req, res) => {
    try {
        const { business_name, contact_person, email, phone, location, buyer_type } = req.body;

        // Validation
        if (!business_name || !contact_person || !phone || !location) {
            return res.status(400).json({
                success: false,
                error: 'Business name, contact person, phone, and location are required.'
            });
        }

        const result = await query(
            `INSERT INTO buyers (business_name, contact_person, email, phone, location, buyer_type)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, business_name, contact_person, phone, location, status, created_at`,
            [business_name, contact_person, email || null, phone, location, buyer_type || 'wholesale']
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            const field = err.constraint.includes('phone') ? 'phone number' : 'email';
            return res.status(409).json({
                success: false,
                error: `A buyer with this ${field} is already registered.`
            });
        }
        console.error('Error registering buyer:', err);
        res.status(500).json({ success: false, error: 'Failed to register buyer' });
    }
});

// ------------------------------------------
// ORDERS
// ------------------------------------------

// GET /api/orders — List recent orders
app.get('/api/orders', async (req, res) => {
    try {
        const result = await query(
            `SELECT
                o.id, o.quantity, o.unit, o.price_per_unit, o.total_price,
                o.currency, o.status, o.delivery_date, o.notes, o.created_at,
                f.first_name || ' ' || f.last_name AS farmer_name,
                f.district AS farmer_district,
                b.business_name AS buyer_name,
                b.location AS buyer_location,
                c.name AS crop_name
             FROM orders o
             JOIN farmers f ON o.farmer_id = f.id
             JOIN buyers b ON o.buyer_id = b.id
             JOIN crops c ON o.crop_id = c.id
             ORDER BY o.created_at DESC
             LIMIT 50`
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
});

// POST /api/orders — Create a new order
app.post('/api/orders', async (req, res) => {
    try {
        const { farmer_id, buyer_id, crop_id, quantity, unit, price_per_unit, delivery_date, notes } = req.body;

        if (!farmer_id || !buyer_id || !crop_id || !quantity || !price_per_unit) {
            return res.status(400).json({
                success: false,
                error: 'Farmer, buyer, crop, quantity, and price are required.'
            });
        }

        const result = await query(
            `INSERT INTO orders (farmer_id, buyer_id, crop_id, quantity, unit, price_per_unit, delivery_date, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [farmer_id, buyer_id, crop_id, quantity, unit || 'kg', price_per_unit, delivery_date || null, notes || null]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ success: false, error: 'Failed to create order' });
    }
});

// ------------------------------------------
// TESTIMONIALS
// ------------------------------------------

// GET /api/testimonials — Get featured testimonials
app.get('/api/testimonials', async (req, res) => {
    try {
        const result = await query(
            `SELECT id, author_name, author_role, content, rating, is_featured
             FROM testimonials
             WHERE is_featured = true
             ORDER BY created_at DESC`
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Error fetching testimonials:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch testimonials' });
    }
});

// ------------------------------------------
// DASHBOARD STATS
// ------------------------------------------

// GET /api/stats — Platform overview statistics
app.get('/api/stats', async (req, res) => {
    try {
        const [farmersCount, buyersCount, cropsCount, ordersCount] = await Promise.all([
            query("SELECT COUNT(*) FROM farmers WHERE status = 'active'"),
            query("SELECT COUNT(*) FROM buyers WHERE status = 'active'"),
            query('SELECT COUNT(*) FROM crops'),
            query('SELECT COUNT(*) FROM orders'),
        ]);

        res.json({
            success: true,
            data: {
                active_farmers: parseInt(farmersCount.rows[0].count),
                active_buyers: parseInt(buyersCount.rows[0].count),
                total_crops: parseInt(cropsCount.rows[0].count),
                total_orders: parseInt(ordersCount.rows[0].count),
            }
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
    }
});

// ============================================
// CATCH-ALL: Serve index.html for SPA routes
// ============================================

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║        🌿 Salone FarmHub Server 🌿          ║
║──────────────────────────────────────────────║
║  Status:  Running                            ║
║  Port:    ${PORT}                                ║
║  URL:     http://localhost:${PORT}                ║
║  Mode:    ${process.env.NODE_ENV || 'development'}                        ║
╚══════════════════════════════════════════════╝
    `);
});
