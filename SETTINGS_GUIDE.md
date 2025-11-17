# Settings System Guide

## What Was Added

### 1. Settings Page in Dashboard
Navigate to **Paramètres** in the sidebar to manage:

#### General Settings
- **Free Delivery Threshold**: Change the minimum order amount for free delivery (default: $75)
- **Contact Email**: Set contact email (default: lemtnacanada@gmail.com)
- **Restaurant Type**: Change from "Marocaine" to "Canadienne" or any other type

#### Delivery Zones
- **View all zones**: See all delivery zones
- **Add zones**: Add new delivery zones with name and description
- **Delete zones**: Remove zones you don't need anymore

### 2. Featured Dishes (Star System)
In the **Menu** tab:
- Click the **star icon** on any dish to mark it as featured
- Featured dishes (with yellow star) will appear in "Meilleurs Repas" section on website
- Click again to unfeature

### 3. Database Tables Created

Run `settings-schema.sql` in Supabase to create:

#### `settings` table
```sql
- key: Setting name
- value: Setting value
- updated_at: Last update timestamp
```

#### `delivery_zones` table
```sql
- id: Auto-increment
- name: Zone name (e.g., "Montréal")
- description: Optional description
- display_order: Order to display
- created_at: Creation timestamp
```

#### `dishes` table update
```sql
- is_featured: Boolean (true = show in featured section)
```

## Setup Instructions

### 1. Run SQL Script
```bash
# In Supabase SQL Editor, run:
settings-schema.sql
```

This will:
- Create `settings` table
- Create `delivery_zones` table
- Add `is_featured` column to `dishes`
- Insert default settings:
  - free_delivery_threshold: 75
  - contact_email: lemtnacanada@gmail.com
  - restaurant_type: Canadienne
- Insert 4 default delivery zones

### 2. Access Settings
1. Open dashboard: http://localhost:3000
2. Click "Paramètres" in sidebar
3. Modify settings as needed
4. Click "Enregistrer les paramètres"

### 3. Manage Delivery Zones
1. In Paramètres page, scroll to "Zones de Livraison"
2. See existing zones
3. Add new zone:
   - Enter zone name
   - Enter description (optional)
   - Click "Ajouter la zone"
4. Delete zone: Click trash icon

### 4. Feature Dishes
1. Go to "Menu" tab
2. Click star icon on dishes you want to feature
3. Yellow star = featured
4. Gray star = not featured

## How It Works on Website

### Free Delivery Message
Website will display:
```
Livraison GRATUITE sur toutes les commandes de $[threshold]+
```
Where `[threshold]` comes from settings.

### Delivery Zones
The "ZONES DE LIVRAISON" section will show all zones from database.

### Featured Dishes
Dishes with `is_featured = true` will appear in:
- Homepage carousel
- "Meilleurs Repas" section
- Special promotions

### Contact Email
Footer and contact forms will use the email from settings.

### Restaurant Type
All mentions of "Marocaine" will be replaced with value from settings (e.g., "Canadienne").

## Default Values

After running SQL:
- **Free Delivery**: $75
- **Email**: lemtnacanada@gmail.com
- **Type**: Canadienne
- **Zones**: Montréal, Laval, Longueuil, Brossard

## Future Enhancements

### Language Switcher (Next Step)
- French/Arabic toggle next to cart icon
- Translations stored in database
- Switch language dynamically

### Additional Settings
- Opening hours
- Phone number
- Social media links
- Promo banner text
- Tax rate
- Delivery fee

## Testing

1. **Change threshold**:
   - Set to $50
   - Check website shows "Livraison GRATUITE sur toutes les commandes de $50+"

2. **Add delivery zone**:
   - Add "Québec City"
   - Check website shows new zone

3. **Feature a dish**:
   - Star "Couscous Royal"
   - Check it appears in featured section

4. **Change restaurant type**:
   - Change to "Canadienne"
   - Check all "Marocaine" text is replaced

## Database Queries

### View all settings
```sql
SELECT * FROM settings;
```

### View all zones
```sql
SELECT * FROM delivery_zones ORDER BY display_order;
```

### View featured dishes
```sql
SELECT * FROM dishes WHERE is_featured = true;
```

### Update a setting
```sql
UPDATE settings SET value = '100' WHERE key = 'free_delivery_threshold';
```

## Troubleshooting

**Settings not saving?**
- Check Supabase connection
- Verify RLS policies are enabled
- Check browser console for errors

**Zones not showing?**
- Verify SQL script ran successfully
- Check `delivery_zones` table exists
- Refresh dashboard

**Star not working?**
- Check `is_featured` column exists in `dishes` table
- Run SQL script if missing
- Refresh page

---

**Dashboard is ready with settings!** 🎉
Open http://localhost:3000 and click "Paramètres"
