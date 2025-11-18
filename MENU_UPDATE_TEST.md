# Menu Update Testing Guide

## Issue Fixed
The menu manager was not updating dishes properly. This has been fixed.

## What Was Wrong
- The update query was only including the image if it changed
- This caused issues when updating just the name or price
- The image field was being skipped in updates

## What Was Fixed
1. **Always include image in updates** - Even if unchanged
2. **Added console logging** - To debug update issues
3. **Better error messages** - Shows actual error from Supabase
4. **Return updated data** - Using `.select()` to verify update

## How to Test

### Test 1: Update Dish Name
1. Open dashboard at http://localhost:3000
2. Click "Modifier" on any dish
3. Change the name (e.g., "Couscous" → "Couscous Royal")
4. Click "Enregistrer"
5. ✅ Should see success message
6. ✅ Check browser console for "Update successful" log
7. ✅ Refresh page - name should be updated

### Test 2: Update Dish Price
1. Click "Modifier" on a dish
2. Change only the price (e.g., 15.00 → 18.00)
3. Click "Enregistrer"
4. ✅ Price should update immediately

### Test 3: Update Dish Image (URL)
1. Click "Modifier" on a dish
2. Make sure "URL" tab is selected
3. Change the image URL
4. Click "Enregistrer"
5. ✅ Image should update

### Test 4: Update Dish Image (Upload)
1. Click "Modifier" on a dish
2. Click "Télécharger" tab
3. Select an image file
4. ✅ Should show file size (e.g., "250 KB" not "0.00 MB")
5. Click "Enregistrer"
6. ✅ Image should upload and update

### Test 5: Toggle Featured Star
1. Click the star icon on any dish
2. ✅ Star should turn bright yellow when featured
3. ✅ Star should be gray when not featured
4. ✅ Changes should save immediately

## Check Website Updates
After updating in dashboard:
1. Go to website at http://localhost:8080
2. Navigate to menu page
3. Hard refresh (Ctrl+Shift+R)
4. ✅ Changes should be visible

## Troubleshooting

### If updates still don't work:
1. Check browser console for errors
2. Look for "Update successful" log
3. Check Supabase dashboard → Table Editor → dishes table
4. Verify RLS policies allow updates

### Run this SQL in Supabase if needed:
```sql
-- Allow all operations for anon key (for testing)
DROP POLICY IF EXISTS "Allow all operations for service role" ON dishes;

CREATE POLICY "Allow all operations" ON dishes
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

## Console Logs to Look For
- ✅ "Updating dish: [id] {name, price, image}"
- ✅ "Update successful: [data]"
- ❌ "Update error: [error]" - If you see this, check the error message
