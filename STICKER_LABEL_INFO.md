# E-Ticket Sticker Label

## Overview
The e-ticket has been redesigned as a compact sticker label (4x6 inches) suitable for placing on delivery boxes.

## Features

### Design Elements
- **Logo Image**: Your restaurant logo (logo.png) displayed at the top
- **Color Code Strip**: Each order gets a unique color code for quick visual identification
- **Restaurant Info**: Address and phone number prominently displayed
- **Customer Details**: Delivery address and contact information
- **Order ID**: Clearly visible order number with date
- **Large QR Code**: 280x280px QR code containing full order details
- **EAN-13 Barcode**: Professional retail-standard barcode (like on food products)
- **No Emojis**: Clean, professional text-only design

### What's Stored in the QR Code
When scanned, the QR code contains:
- Order ID
- Customer name
- Customer phone
- Delivery address
- All order items with quantities and prices
- Total amount
- Order date
- Color code for visual matching

### What's Stored in the Barcode
The barcode uses EAN-13 format (standard retail barcode):
- Format: `200` (prefix) + 9-digit order ID + check digit
- Example: Order #123 becomes `2000000001234`
- Can be scanned with any standard barcode scanner

## Usage

1. Navigate to the Orders page in the dashboard
2. Find the order you want to create a label for
3. Click "Télécharger Étiquette" button
4. A PDF file will be downloaded in 4x6 inch format
5. Print the PDF on sticker paper
6. Apply the sticker to your delivery box

## Printing Recommendations

- **Paper Size**: 4x6 inch sticker labels
- **Print Quality**: High quality (300 DPI minimum)
- **Paper Type**: Adhesive sticker paper
- **Color**: Black and white is sufficient, but color printing will show the red logo

## Customization

### Logo
Replace `/public/logo.png` with your restaurant logo image. Recommended size: 180px width, transparent background.

### Restaurant Information
Edit the following in `components/shipping-label.tsx`:
- Address: Line 133
- Phone number: Line 134
- Website: Line 168

### Color Codes
The system automatically assigns one of 6 colors to orders based on order ID. To customize colors, edit the `generateColorCode` function (Line 16).

## Technical Details

- Format: PDF (4x6 inches)
- QR Code: High error correction level (H), 300x300px
- Barcode: EAN-13 standard format (13 digits)
- Color Coding: 6 unique colors for visual order identification
- File naming: `Etiquette-{ORDER_ID}.pdf`
- Logo: Loaded from `/public/logo.png`
