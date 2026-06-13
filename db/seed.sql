-- ============================================
-- Salone FarmHub — Seed Data
-- ============================================
-- Sample data for development and demonstration
-- ============================================

-- ============================================
-- CROPS
-- ============================================

INSERT INTO crops (id, name, category, description, season) VALUES
    ('a1b2c3d4-0001-4000-8000-000000000001', 'Rice', 'Grains', 'Staple crop grown across all regions of Sierra Leone.', 'May - November'),
    ('a1b2c3d4-0002-4000-8000-000000000002', 'Cassava', 'Root Crops', 'Versatile root crop used for garri, fufu, and flour.', 'Year-round'),
    ('a1b2c3d4-0003-4000-8000-000000000003', 'Palm Oil', 'Oil Crops', 'Red palm oil, a key ingredient in Sierra Leonean cuisine.', 'January - April'),
    ('a1b2c3d4-0004-4000-8000-000000000004', 'Groundnuts', 'Legumes', 'Peanuts used in cooking and as a protein source.', 'June - October'),
    ('a1b2c3d4-0005-4000-8000-000000000005', 'Sweet Potatoes', 'Root Crops', 'Nutritious tuber popular in rural markets.', 'Year-round'),
    ('a1b2c3d4-0006-4000-8000-000000000006', 'Cocoa', 'Cash Crops', 'Export-grade cocoa beans grown in eastern regions.', 'October - March'),
    ('a1b2c3d4-0007-4000-8000-000000000007', 'Pepper', 'Vegetables', 'Hot peppers used in nearly every local dish.', 'Year-round'),
    ('a1b2c3d4-0008-4000-8000-000000000008', 'Tomatoes', 'Vegetables', 'Fresh tomatoes essential for sauces and stews.', 'Year-round'),
    ('a1b2c3d4-0009-4000-8000-000000000009', 'Plantain', 'Fruits', 'Cooking banana popular in local cuisine.', 'Year-round'),
    ('a1b2c3d4-0010-4000-8000-000000000010', 'Maize', 'Grains', 'Corn used for food and livestock feed.', 'May - September');

-- ============================================
-- FARMERS
-- ============================================

INSERT INTO farmers (id, first_name, last_name, email, phone, district, chiefdom, village, farm_size_acres, status) VALUES
    ('f1000001-0001-4000-8000-000000000001', 'Adama', 'Kamara', 'adama.kamara@email.com', '+23276000001', 'Kenema', 'Nongowa', 'Blama', 5.50, 'active'),
    ('f1000001-0002-4000-8000-000000000002', 'Nene', 'Jalloh', 'nene.jalloh@email.com', '+23276000002', 'Bo', 'Kakua', 'Tikonko', 3.20, 'active'),
    ('f1000001-0003-4000-8000-000000000003', 'Ibrahim', 'Sesay', 'ibrahim.sesay@email.com', '+23276000003', 'Bombali', 'Makari Gbanti', 'Kamabai', 8.00, 'active'),
    ('f1000001-0004-4000-8000-000000000004', 'Fatmata', 'Bangura', 'fatmata.b@email.com', '+23276000004', 'Port Loko', 'Maforki', 'Lunsar', 2.75, 'active'),
    ('f1000001-0005-4000-8000-000000000005', 'Mohamed', 'Koroma', 'mohamed.k@email.com', '+23276000005', 'Kailahun', 'Luawa', 'Kailahun Town', 6.00, 'pending');

-- ============================================
-- BUYERS
-- ============================================

INSERT INTO buyers (id, business_name, contact_person, email, phone, location, buyer_type, status) VALUES
    ('b2000001-0001-4000-8000-000000000001', 'Freetown Fresh Market', 'Momoh Conteh', 'momoh@freetownfresh.sl', '+23278000001', 'Freetown', 'wholesale', 'active'),
    ('b2000001-0002-4000-8000-000000000002', 'Bo Agri Supplies', 'Aminata Koroma', 'aminata@boagri.sl', '+23278000002', 'Bo', 'wholesale', 'active'),
    ('b2000001-0003-4000-8000-000000000003', 'Makeni Market Hub', 'Alusine Kamara', 'alusine@makenihub.sl', '+23278000003', 'Makeni', 'retail', 'active'),
    ('b2000001-0004-4000-8000-000000000004', 'Export SL Ltd', 'David Johnson', 'david@exportsl.sl', '+23278000004', 'Freetown', 'export', 'active');

-- ============================================
-- MARKET PRICES (Recent data)
-- ============================================

INSERT INTO market_prices (crop_id, market_name, price, unit, price_date, source) VALUES
    -- Rice prices
    ('a1b2c3d4-0001-4000-8000-000000000001', 'Freetown Central Market', 15000.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0001-4000-8000-000000000001', 'Bo Market', 13500.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0001-4000-8000-000000000001', 'Kenema Market', 14000.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0001-4000-8000-000000000001', 'Makeni Market', 13800.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),

    -- Cassava prices
    ('a1b2c3d4-0002-4000-8000-000000000002', 'Freetown Central Market', 5000.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0002-4000-8000-000000000002', 'Bo Market', 4200.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0002-4000-8000-000000000002', 'Kenema Market', 4500.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),

    -- Palm Oil prices
    ('a1b2c3d4-0003-4000-8000-000000000003', 'Freetown Central Market', 80000.00, 'ton', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0003-4000-8000-000000000003', 'Bo Market', 75000.00, 'ton', CURRENT_DATE, 'Salone FarmHub Survey'),

    -- Groundnut prices
    ('a1b2c3d4-0004-4000-8000-000000000004', 'Freetown Central Market', 12000.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0004-4000-8000-000000000004', 'Makeni Market', 11000.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),

    -- Sweet Potato prices
    ('a1b2c3d4-0005-4000-8000-000000000005', 'Freetown Central Market', 3500.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0005-4000-8000-000000000005', 'Bo Market', 3000.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),

    -- Cocoa prices
    ('a1b2c3d4-0006-4000-8000-000000000006', 'Freetown Central Market', 250000.00, 'ton', CURRENT_DATE, 'Salone FarmHub Survey'),

    -- Pepper prices
    ('a1b2c3d4-0007-4000-8000-000000000007', 'Freetown Central Market', 8000.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0007-4000-8000-000000000007', 'Bo Market', 7500.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),

    -- Tomato prices
    ('a1b2c3d4-0008-4000-8000-000000000008', 'Freetown Central Market', 6000.00, 'crate', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0008-4000-8000-000000000008', 'Bo Market', 5500.00, 'crate', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0008-4000-8000-000000000008', 'Kenema Market', 5200.00, 'crate', CURRENT_DATE, 'Salone FarmHub Survey'),

    -- Plantain prices
    ('a1b2c3d4-0009-4000-8000-000000000009', 'Freetown Central Market', 2500.00, 'bunch', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0009-4000-8000-000000000009', 'Makeni Market', 2000.00, 'bunch', CURRENT_DATE, 'Salone FarmHub Survey'),

    -- Maize prices
    ('a1b2c3d4-0010-4000-8000-000000000010', 'Freetown Central Market', 10000.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey'),
    ('a1b2c3d4-0010-4000-8000-000000000010', 'Bo Market', 9500.00, 'bag', CURRENT_DATE, 'Salone FarmHub Survey');

-- ============================================
-- ORDERS (Sample transactions)
-- ============================================

INSERT INTO orders (farmer_id, buyer_id, crop_id, quantity, unit, price_per_unit, status, delivery_date, notes) VALUES
    ('f1000001-0001-4000-8000-000000000001', 'b2000001-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 50, 'bag', 14500.00, 'delivered', CURRENT_DATE - INTERVAL '5 days', 'First successful trade through Salone FarmHub'),
    ('f1000001-0002-4000-8000-000000000002', 'b2000001-0002-4000-8000-000000000002', 'a1b2c3d4-0008-4000-8000-000000000008', 30, 'crate', 5500.00, 'delivered', CURRENT_DATE - INTERVAL '3 days', 'Fresh tomatoes from Bo'),
    ('f1000001-0003-4000-8000-000000000003', 'b2000001-0003-4000-8000-000000000003', 'a1b2c3d4-0002-4000-8000-000000000002', 100, 'bag', 4200.00, 'in_transit', CURRENT_DATE + INTERVAL '2 days', 'Large cassava order for Makeni market'),
    ('f1000001-0001-4000-8000-000000000001', 'b2000001-0004-4000-8000-000000000004', 'a1b2c3d4-0006-4000-8000-000000000006', 5, 'ton', 250000.00, 'confirmed', CURRENT_DATE + INTERVAL '7 days', 'Export-grade cocoa shipment'),
    ('f1000001-0004-4000-8000-000000000004', 'b2000001-0001-4000-8000-000000000001', 'a1b2c3d4-0009-4000-8000-000000000009', 200, 'bunch', 2500.00, 'pending', CURRENT_DATE + INTERVAL '4 days', 'Plantain bulk order');

-- ============================================
-- TESTIMONIALS (Matching current website content)
-- ============================================

INSERT INTO testimonials (author_name, author_role, content, rating, is_featured, farmer_id) VALUES
    ('Adama Kamara', 'Rice Farmer, Kenema',
     'Salone FarmHub helped me sell my cassava at a fair price and connect with buyers in Freetown. I no longer wait weeks for market updates.',
     5, true, 'f1000001-0001-4000-8000-000000000001'),

    ('Nene Jalloh', 'Vegetable Grower, Bo',
     'The platform is simple to use, and the prices are accurate. I can now plan my harvest better and keep more profit in my family.',
     5, true, 'f1000001-0002-4000-8000-000000000002');

INSERT INTO testimonials (author_name, author_role, content, rating, is_featured, buyer_id) VALUES
    ('Momoh Conteh', 'Market Vendor, Makeni',
     'Buyers trust the data from Salone FarmHub, so I get faster offers and better terms. This has changed our community market.',
     5, true, 'b2000001-0001-4000-8000-000000000001');
