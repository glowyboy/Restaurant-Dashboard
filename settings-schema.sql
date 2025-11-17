-- Settings table for website configuration
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery zones table
CREATE TABLE IF NOT EXISTS delivery_zones (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add is_featured column to dishes table for starring
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read on settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow public update on settings" ON settings FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on settings" ON settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on delivery_zones" ON delivery_zones FOR SELECT USING (true);
CREATE POLICY "Allow public insert on delivery_zones" ON delivery_zones FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on delivery_zones" ON delivery_zones FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on delivery_zones" ON delivery_zones FOR DELETE USING (true);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('free_delivery_threshold', '75'),
  ('contact_email', 'lemtnacanada@gmail.com'),
  ('restaurant_type', 'Canadienne')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert default delivery zones
INSERT INTO delivery_zones (name, display_order) VALUES
  ('Montréal', 1),
  ('Laval', 2),
  ('Longueuil', 3),
  ('Brossard', 4)
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for settings table
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
