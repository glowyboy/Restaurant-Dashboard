# 🗑️ Order Cleanup Guide

## Why "2 Days" in the Error?

The error about "2 days" is unrelated - it's just part of the cron syntax that failed. Ignore it!

The real issue: **pg_cron extension not available on free tier**

## ✅ Simple Solution: Manual Cleanup

### Run This Once a Month:

1. **Go to Supabase SQL Editor**
2. **Copy this**:
```sql
DELETE FROM orders WHERE created_at < NOW() - INTERVAL '3 months';
```
3. **Click Run**
4. Done! Old orders deleted.

### How Often?

**Option 1: Monthly** (Recommended)
- Set a calendar reminder
- Run on 1st of each month
- Takes 5 seconds

**Option 2: When You Remember**
- Every 2-3 months is fine
- Safe to run anytime
- Won't delete recent orders

**Option 3: Never** (Also OK!)
- Database will fill up slowly
- Takes 2-4 years to hit limit
- You'll get a warning when close

## 📊 What Gets Deleted?

**Deleted:**
- Orders older than 3 months
- Example: Today is Nov 17, 2025
  - Deletes orders before Aug 17, 2025
  - Keeps orders from Aug 17 - Nov 17

**Kept:**
- Last 3 months of orders
- All dishes, plans, settings
- Everything else

## 🔍 Check Before Deleting

Want to see what will be deleted?

```sql
-- Preview (doesn't delete)
SELECT COUNT(*), MIN(created_at), MAX(created_at)
FROM orders 
WHERE created_at < NOW() - INTERVAL '3 months';
```

Shows:
- How many orders will be deleted
- Oldest order date
- Newest order that will be deleted

## 📅 Set a Reminder

### Google Calendar:
1. Create event: "Delete old orders"
2. Set to repeat monthly
3. Add link to Supabase SQL Editor

### Phone Reminder:
1. Set monthly reminder
2. "Run cleanup SQL in Supabase"

### Or Just Remember:
- When you check dashboard
- Once every few months
- Whenever you think of it

## 🎯 Alternative: Export Before Delete

Want to keep records?

```sql
-- Export to CSV first (in Supabase Table Editor)
-- 1. Go to Table Editor → orders
-- 2. Filter: created_at < 3 months ago
-- 3. Click "Export" → CSV
-- 4. Then run delete query
```

## ⚠️ What If I Forget?

**No problem!**

- Database fills up slowly
- Takes 2-4 years to hit 500 MB
- Supabase warns you at 80% full
- You can delete then

**You won't lose data or break anything!**

## 🚀 Quick Reference

### Delete orders older than 3 months:
```sql
DELETE FROM orders WHERE created_at < NOW() - INTERVAL '3 months';
```

### Delete orders older than 6 months:
```sql
DELETE FROM orders WHERE created_at < NOW() - INTERVAL '6 months';
```

### Delete orders older than 1 year:
```sql
DELETE FROM orders WHERE created_at < NOW() - INTERVAL '1 year';
```

### Check database size:
```sql
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as size;
```

## 💡 Pro Tip

If you upgrade to Supabase Pro later, you can enable automatic cleanup with pg_cron. But for free tier, manual is perfect!

---

**TL;DR:** Run `DELETE FROM orders WHERE created_at < NOW() - INTERVAL '3 months';` once a month in Supabase SQL Editor. That's it! 🎉
