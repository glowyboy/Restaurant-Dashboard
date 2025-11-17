-- Enable Realtime for Dashboard
-- Run this in Supabase SQL Editor

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Enable realtime for dishes table
ALTER PUBLICATION supabase_realtime ADD TABLE dishes;

-- Verify it worked
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
