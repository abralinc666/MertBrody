-- LovelyCam V4.0 - PostgreSQL Production Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Argon2id PHC string
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'publisher', 'admin')),
    avatar_url TEXT DEFAULT 'user.png',
    bio VARCHAR(160) DEFAULT '',
    balance NUMERIC(12, 2) DEFAULT 0.00,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    kvkk_accepted_at TIMESTAMPTZ,
    last_profile_update TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(80) NOT NULL,
    gender VARCHAR(16) NOT NULL,
    city VARCHAR(64) NOT NULL,
    age INT CHECK (age >= 18),
    height INT,
    weight INT,
    tags VARCHAR(64),
    description TEXT,
    hourly_rate INT DEFAULT 0,
    nightly_rate INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    views INT DEFAULT 0,
    meetings INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    photos JSONB DEFAULT '[]'::jsonb,
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id VARCHAR(64) NOT NULL,
    recipient_id VARCHAR(64) NOT NULL,
    encrypted_payload JSONB NOT NULL, -- AES-256-GCM { content, iv, alg }
    encrypted_self JSONB,
    has_photo BOOLEAN DEFAULT FALSE,
    media_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(32) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id VARCHAR(64),
    target_id VARCHAR(64) NOT NULL,
    reason VARCHAR(120) NOT NULL,
    details TEXT,
    status VARCHAR(24) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    level VARCHAR(16) NOT NULL,
    message TEXT NOT NULL,
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_city_gender ON profiles(city, gender);
CREATE INDEX idx_messages_participants ON messages(sender_id, recipient_id, created_at DESC);
