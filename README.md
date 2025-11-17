# 🍽️ Lamsalna Restaurant Admin Dashboard

Admin dashboard for managing the Lamsalna restaurant website.

## Features

### 📊 Dashboard Overview
- **Real-time Statistics**: Total revenue, orders, menu items, average basket
- **Orders Chart**: 7-day order trends with bar chart
- **Status Distribution**: Pie chart showing paid vs pending orders
- **Popular Dishes**: Top 5 dishes by order

### 📦 Orders Management
- View all orders with details
- Filter by status (paid/pending)
- View order details (plan, items, customer preferences)
- Update order status
- Real-time updates via Supabase subscriptions

### 🍴 Menu Management
- View all dishes with images
- Add new dishes
- Edit existing dishes (name, price, image)
- Delete dishes
- Real-time menu updates

## Design

- **Color Scheme**: Red/terracotta primary color matching the restaurant logo
- **Logo**: Restaurant logo displayed in header
- **Live Indicator**: Shows real-time connection status
- **Responsive**: Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (shared with main website)
- **UI**: shadcn/ui components
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Notifications**: Sonner

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment variables** (already configured):
   - Uses same Supabase credentials as main website
   - `.env.local` file already created

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open dashboard**:
   ```
   http://localhost:3000
   ```

## Usage

### View Orders
1. Dashboard loads with statistics
2. Click "Commandes" tab
3. View all orders in table
4. Click eye icon to see order details
5. Click "Marquer payée" to update pending orders

### Manage Menu
1. Click "Menu" tab
2. View all dishes in grid
3. Click "Ajouter un plat" to add new dish
4. Click "Modifier" to edit existing dish
5. Click trash icon to delete dish

### Real-time Updates
- Dashboard automatically updates when:
  - New orders are placed on website
  - Order status changes
  - Menu items are added/edited/deleted

## Data Structure

### Orders Display
- Order ID
- Plan name (e.g., "3 repas / semaine")
- Number of people
- Meals per day
- Total amount
- Status (paid/pending)
- Date and time
- All items with quantities

### Menu Items
- Dish name
- Price
- Image
- Edit/Delete actions

## Color Scheme

Primary color (from logo):
- Red/Terracotta: `hsl(8, 75%, 62%)`
- Used for: buttons, badges, charts, highlights

Secondary color:
- Sage/Olive Green: `hsl(85, 40%, 52%)`
- Used for: secondary actions

## Screenshots

### Dashboard Overview
- 4 stat cards (revenue, orders, dishes, average)
- Bar chart showing 7-day trends
- Pie chart showing order status
- Top 5 popular dishes

### Orders Table
- Sortable columns
- Status badges
- Action buttons
- Order details modal

### Menu Manager
- Grid layout with dish cards
- Image previews
- Edit/Delete buttons
- Add dish form

## API Endpoints (Supabase)

### Orders
- `GET /orders` - Fetch all orders
- `UPDATE /orders` - Update order status

### Dishes
- `GET /dishes` - Fetch all dishes
- `POST /dishes` - Add new dish
- `UPDATE /dishes` - Update dish
- `DELETE /dishes` - Delete dish

## Real-time Subscriptions

Dashboard subscribes to:
- `orders` table changes
- `dishes` table changes

Updates automatically without refresh!

## Build for Production

```bash
npm run build
npm start
```

## Notes

- Shares same database as main website
- No authentication (add if needed)
- Real-time updates via Supabase
- Responsive design
- Red color theme matching logo
