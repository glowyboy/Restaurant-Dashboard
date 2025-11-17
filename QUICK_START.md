# 🚀 Quick Start - Admin Dashboard

## What You Get

A complete admin dashboard with:
- ✅ Red/terracotta color scheme (matching logo)
- ✅ Restaurant logo in header
- ✅ Real-time order management
- ✅ Menu management (add/edit/delete dishes)
- ✅ Analytics charts and statistics
- ✅ Live updates from Supabase

## Start the Dashboard

```bash
cd "restaurant dashboard"
npm run dev
```

Open: **http://localhost:3000**

## Features

### 📊 Dashboard Overview
- **4 Stat Cards**: Revenue, Orders, Menu Items, Average Basket
- **Orders Chart**: 7-day trend with bar chart
- **Status Pie Chart**: Paid vs Pending orders
- **Top 5 Dishes**: Most popular items

### 📦 Orders Tab
- View all orders in table
- See order details (plan, items, preferences)
- Update order status (pending → paid)
- Real-time updates when customers order

### 🍴 Menu Tab
- View all dishes in grid with images
- Add new dishes
- Edit existing dishes
- Delete dishes
- Changes sync to main website instantly

## What's Different from Main Website

| Feature | Main Website | Admin Dashboard |
|---------|--------------|-----------------|
| Color | Red/Terracotta | Red/Terracotta (same!) |
| Logo | ✅ Yes | ✅ Yes |
| Purpose | Customer orders | Admin management |
| Orders | Create | View & manage |
| Menu | View only | Full CRUD |
| Charts | ❌ No | ✅ Yes |
| Real-time | Cart updates | Order & menu updates |

## Test It Out

### 1. View Orders
- Dashboard shows all orders from main website
- Click eye icon to see order details
- See plan info, items, totals

### 2. Manage Menu
- Click "Menu" tab
- Click "Ajouter un plat" to add new dish
- Fill in name, price, image URL
- New dish appears on main website instantly!

### 3. Update Order Status
- Go to "Commandes" tab
- Find a pending order
- Click "Marquer payée"
- Status updates to paid

### 4. Real-time Test
- Keep dashboard open
- Go to main website (http://localhost:8080)
- Place an order
- Watch dashboard update automatically! 🎉

## Color Scheme

The dashboard uses the same red/terracotta color from your logo:

- **Primary**: Red/Coral (#E8745E)
- **Sidebar**: Red background
- **Buttons**: Red
- **Charts**: Red bars
- **Badges**: Red for paid orders

## Environment Variables

Already configured! Uses same Supabase credentials as main website:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Ports

- **Main Website**: http://localhost:8080
- **Admin Dashboard**: http://localhost:3000

Run both at the same time!

## What's Removed

✅ All unnecessary components removed
✅ Only essential admin features
✅ Clean, focused interface
✅ No bloat, just what you need

## Customization

### Change Logo
Replace `public/logo.png` with your logo

### Adjust Colors
Edit `app/globals.css`:
```css
--primary: oklch(0.72 0.18 25); /* Red color */
```

### Add Features
- Add authentication
- Add user management
- Add reports
- Add notifications

## Troubleshooting

**Dashboard not loading?**
- Check if port 3000 is available
- Verify .env.local file exists
- Run `npm install` again

**Orders not showing?**
- Check Supabase connection
- Verify orders exist in database
- Check browser console for errors

**Menu not updating?**
- Check Supabase permissions
- Verify real-time subscriptions
- Refresh the page

## Next Steps

1. ✅ Dashboard is running
2. ✅ Test order management
3. ✅ Test menu management
4. ✅ Verify real-time updates
5. 🎉 You're ready to manage your restaurant!

## Production Deployment

When ready to deploy:

```bash
npm run build
npm start
```

Deploy to:
- Vercel (recommended for Next.js)
- Netlify
- Your own server

## Support

Check the main README.md for detailed documentation.

---

**Dashboard is live at: http://localhost:3000** 🚀
