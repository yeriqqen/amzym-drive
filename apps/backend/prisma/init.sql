-- Initialize the food delivery database
-- This script runs when the PostgreSQL container starts for the first time

-- Ensure the database exists
CREATE DATABASE IF NOT EXISTS food_delivery;

-- Switch to the food_delivery database
\c food_delivery;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE food_delivery TO postgres;

-- Create initial schema (Prisma will handle this, but we can set up permissions)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Log successful initialization
SELECT 'Database food_delivery initialized successfully' AS status;
