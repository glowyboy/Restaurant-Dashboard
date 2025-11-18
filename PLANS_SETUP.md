# Plans Management Setup

## Overview
You can now manage your restaurant plans directly from the dashboard settings page.

## Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  meals INTEGER NOT NULL,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON plans;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON plans;
DROP POLICY IF EXISTS "Allow all access to plans" ON plans;

-- Allow all operations (read, insert, update, delete)
CREATE POLICY "Allow all access to plans" ON plans
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default plans
INSERT INTO plans (name, price, meals, is_popular)
VALUES
  ('Plan Individuel', 14.99, 5, false),
  ('Plan Familial', 12.99, 10, true),
  ('Plan Premium', 10.99, 20, false);
```

## Features

### View Plans
- See all your plans with their details (name, price, meals, popularity)
- Plans are displayed in order by number of meals

### Add New Plans
- Name: The plan name (e.g., "Plan Familial")
- Price: Price per meal in dollars
- Meals: Number of meals included
- Popular: Mark as popular to show a badge on the website

### Edit Plans
- Click the edit icon to modify any plan
- Update name, price, meals, or popularity status
- Save changes or cancel

### Delete Plans
- Click the trash icon to remove a plan
- Confirmation required before deletion

## How It Works

1. **Dashboard**: Manage plans in Settings → Plans Management
2. **Website**: Plans automatically appear on the Menu page
3. **Orders**: Selected plans are saved with customer orders

## Plan Structure

Each plan has:
- **Name**: Display name (e.g., "Plan Familial")
- **Price**: Cost per meal ($)
- **Meals**: Number of meals included
- **Is Popular**: Shows "Populaire" badge on website

## Tips

- Mark your best-selling plan as "Popular" to highlight it
- Lower price per meal for plans with more meals to encourage bulk orders
- Keep plan names short and descriptive
- Update prices seasonally if needed
