-- Create plans table if it doesn't exist
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

-- Create policy to allow all operations (read, insert, update, delete)
CREATE POLICY "Allow all access to plans" ON plans
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default plans if table is empty
INSERT INTO plans (name, price, meals, is_popular)
SELECT * FROM (VALUES
  ('Plan Individuel', 14.99, 5, false),
  ('Plan Familial', 12.99, 10, true),
  ('Plan Premium', 10.99, 20, false)
) AS v(name, price, meals, is_popular)
WHERE NOT EXISTS (SELECT 1 FROM plans);
