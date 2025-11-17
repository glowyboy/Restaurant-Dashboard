# Enable Supabase Realtime

## Issue
Dashboard requires refresh to see new orders.

## Solution
Enable Realtime in Supabase for the tables.

## Steps

### 1. Go to Supabase Dashboard
https://supabase.com/dashboard/project/ecfrmrhokwtvicvucang

### 2. Enable Realtime for Tables

#### Option A: Via Database Settings
1. Click "Database" in left sidebar
2. Click "Replication" 
3. Find these tables and enable replication:
   - `orders` ✅
   - `dishes` ✅
   - `settings` (optional)
   - `delivery_zones` (optional)

#### Option B: Via SQL
Run this in SQL Editor:

```sql
-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Enable realtime for dishes table
ALTER PUBLICATION supabase_realtime ADD TABLE dishes;

-- Optional: Enable for settings
ALTER PUBLICATION supabase_realtime ADD TABLE settings;

-- Optional: Enable for delivery zones
ALTER PUBLICATION supabase_realtime ADD TABLE delivery_zones;
```

### 3. Verify It's Working

1. Open dashboard: http://localhost:3000
2. Open browser console (F12)
3. Look for these messages:
   ```
   Orders subscription status: SUBSCRIBED
   Dishes subscription status: SUBSCRIBED
   ```

4. Place a test order on website
5. Dashboard should update automatically (no refresh needed!)

## How It Works

### Dashboard (Admin Only)
```typescript
// Listens for changes
supabase
  .channel('public:orders')
  .on('postgres_changes', { table: 'orders' }, () => {
    fetchOrders(); // Auto-refresh when order added
  })
  .subscribe();
```

### Website (Customers)
- ❌ No real-time subscriptions
- ✅ Uses cache (no bandwidth waste)
- ✅ Only admin dashboard uses real-time

## Bandwidth Impact

### With Realtime Enabled:
- **Dashboard (you)**: ~1 KB/minute (negligible)
- **Website (customers)**: 0 KB (no real-time)
- **Total impact**: Minimal (only 1 admin user)

### Why It's Safe:
1. Only dashboard subscribes (not customers)
2. Only you use dashboard
3. Realtime only for 2 tables
4. Bandwidth: ~1 KB per change notification
5. Even with 1000 orders/day: ~1 MB/day

## Troubleshooting

### "Subscription status: CLOSED"
- Realtime not enabled for table
- Run SQL commands above

### "Subscription status: CHANNEL_ERROR"
- Check Supabase project is active
- Verify API keys are correct
- Check browser console for errors

### Still need to refresh?
1. Check console for subscription status
2. Verify realtime is enabled in Supabase
3. Try hard refresh (Ctrl+Shift+R)
4. Check if RLS policies allow SELECT

## Test Real-time

### Quick Test:
1. Open dashboard
2. Open Supabase Table Editor in another tab
3. Manually insert a row in `orders` table
4. Dashboard should update within 1-2 seconds!

### Full Test:
1. Open dashboard
2. Open website in another browser/incognito
3. Place an order on website
4. Watch dashboard update automatically! 🎉

## Console Messages

When working correctly, you'll see:
```
Orders subscription status: SUBSCRIBED
Dishes subscription status: SUBSCRIBED
Order change detected: { eventType: 'INSERT', new: {...} }
```

When there's an issue:
```
Orders subscription status: CLOSED
// or
Orders subscription status: CHANNEL_ERROR
```

## Summary

✅ **Enable realtime** for `orders` and `dishes` tables
✅ **Only dashboard** uses real-time (not customers)
✅ **Minimal bandwidth** (~1 KB per change)
✅ **Auto-updates** when orders come in

Run the SQL commands above and your dashboard will update in real-time! 🚀
