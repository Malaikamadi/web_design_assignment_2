-- ============================================
-- Salone FarmHub — Database Schema
-- ============================================
-- A complete PostgreSQL schema for the
-- Salone FarmHub agricultural marketplace.
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE unit_type AS ENUM ('kg', 'ton', 'bag', 'bunch', 'crate', 'piece');

-- ============================================
-- 1. FARMERS TABLE
-- ============================================
-- Stores registered farmer profiles

CREATE TABLE farmers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255) UNIQUE,
    phone           VARCHAR(20) NOT NULL UNIQUE,
    district        VARCHAR(100) NOT NULL,
    chiefdom        VARCHAR(100),
    village         VARCHAR(100),
    farm_size_acres DECIMAL(10, 2),
    status          user_status DEFAULT 'pending',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_farmers_district ON farmers(district);
CREATE INDEX idx_farmers_status ON farmers(status);
CREATE INDEX idx_farmers_phone ON farmers(phone);

-- ============================================
-- 2. BUYERS TABLE
-- ============================================
-- Stores registered buyer/vendor profiles

CREATE TABLE buyers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name   VARCHAR(255) NOT NULL,
    contact_person  VARCHAR(200) NOT NULL,
    email           VARCHAR(255) UNIQUE,
    phone           VARCHAR(20) NOT NULL UNIQUE,
    location        VARCHAR(200) NOT NULL,
    buyer_type      VARCHAR(50) DEFAULT 'wholesale',
    status          user_status DEFAULT 'pending',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_buyers_location ON buyers(location);
CREATE INDEX idx_buyers_status ON buyers(status);

-- ============================================
-- 3. CROPS TABLE
-- ============================================
-- Master list of crops traded on the platform

CREATE TABLE crops (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL UNIQUE,
    category        VARCHAR(100),
    description     TEXT,
    season          VARCHAR(100),
    image_url       VARCHAR(500),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_crops_category ON crops(category);

-- ============================================
-- 4. MARKET PRICES TABLE
-- ============================================
-- Real-time pricing data for crops at various markets

CREATE TABLE market_prices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crop_id         UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    market_name     VARCHAR(200) NOT NULL,
    price           DECIMAL(12, 2) NOT NULL,
    unit            unit_type DEFAULT 'kg',
    currency        VARCHAR(10) DEFAULT 'SLE',
    price_date      DATE NOT NULL DEFAULT CURRENT_DATE,
    source          VARCHAR(200),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_market_prices_crop ON market_prices(crop_id);
CREATE INDEX idx_market_prices_date ON market_prices(price_date DESC);
CREATE INDEX idx_market_prices_market ON market_prices(market_name);

-- ============================================
-- 5. ORDERS TABLE
-- ============================================
-- Trade transactions between farmers and buyers

CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id       UUID NOT NULL REFERENCES farmers(id) ON DELETE RESTRICT,
    buyer_id        UUID NOT NULL REFERENCES buyers(id) ON DELETE RESTRICT,
    crop_id         UUID NOT NULL REFERENCES crops(id) ON DELETE RESTRICT,
    quantity        DECIMAL(12, 2) NOT NULL,
    unit            unit_type DEFAULT 'kg',
    price_per_unit  DECIMAL(12, 2) NOT NULL,
    total_price     DECIMAL(14, 2) GENERATED ALWAYS AS (quantity * price_per_unit) STORED,
    currency        VARCHAR(10) DEFAULT 'SLE',
    status          order_status DEFAULT 'pending',
    delivery_date   DATE,
    notes           TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_farmer ON orders(farmer_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================
-- 6. TESTIMONIALS TABLE
-- ============================================
-- User stories displayed on the website

CREATE TABLE testimonials (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_name     VARCHAR(200) NOT NULL,
    author_role     VARCHAR(200) NOT NULL,
    content         TEXT NOT NULL,
    rating          INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_featured     BOOLEAN DEFAULT false,
    farmer_id       UUID REFERENCES farmers(id) ON DELETE SET NULL,
    buyer_id        UUID REFERENCES buyers(id) ON DELETE SET NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = true;

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
-- Automatically updates the updated_at column

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER set_farmers_updated_at
    BEFORE UPDATE ON farmers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_buyers_updated_at
    BEFORE UPDATE ON buyers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
