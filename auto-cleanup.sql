-- Auto-delete orders older than 3 months
-- This keeps your database small forever!

-- Simple version: Just delete old orders
-- Run this manually once a month (or whenever you remember!)

DELETE FROM orders 
WHERE created_at < NOW() - INTERVAL '3 months';

-- This will delete orders older than 3 months
-- Safe to run multiple times - only deletes old data
-- Recommended: Run once a month
