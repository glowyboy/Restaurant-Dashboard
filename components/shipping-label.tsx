'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { type Order } from '@/lib/supabase';

interface ShippingLabelProps {
  order: Order;
}

export function ShippingLabel({ order }: ShippingLabelProps) {
  // Only black color
  const generateColorCode = (orderId: number) => {
    return '#000000';
  };

  const generateQRCode = async () => {
    const orderData = {
      id: order.id,
      customer: order.customer_name || 'Client',
      phone: order.customer_phone || 'N/A',
      address: order.delivery_address || 'Adresse non fournie',
      items: order.items || [],
      total: order.total,
      date: order.created_at,
      colorCode: generateColorCode(order.id),
    };

    try {
      const qrDataUrl = await QRCode.toDataURL(JSON.stringify(orderData), {
        width: 200,
        margin: 1,
        errorCorrectionLevel: 'H',
      });
      return qrDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }
  };

  const generateEAN13Barcode = (orderId: number): string => {
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');

      // Generate EAN13 barcode (12 digits + 1 check digit)
      // Format: 200 (prefix) + 9 digits order ID
      const barcodeValue = `200${String(orderId).padStart(9, '0')}`;

      // Use JsBarcode to generate EAN13
      JsBarcode(canvas, barcodeValue, {
        format: 'EAN13',
        width: 3,
        height: 80,
        displayValue: true,
        fontSize: 16,
        margin: 10,
        background: '#ffffff',
        lineColor: '#000000',
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating barcode:', error);
      // Fallback barcode
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }
  };

  const downloadLabel = async () => {
    console.log('Download sticker label clicked for order:', order.id);

    try {
      // Generate QR code and barcode
      const qrCode = await generateQRCode();
      const barcode = generateEAN13Barcode(order.id);
      const colorCode = generateColorCode(order.id);
      console.log('QR code and EAN13 barcode generated');

      // Create an iframe to isolate styles
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.width = '600px';
      iframe.style.height = '900px';
      document.body.appendChild(iframe);

      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Cannot access iframe document');

      // Add basic styles to iframe
      const styleContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: white; padding: 0; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body></body>
        </html>
      `;
      iframeDoc.open();
      iframeDoc.write(styleContent);
      iframeDoc.close();

      const tempContainer = iframeDoc.body;

      // Build sticker label (4x6 inch format - 600x900px)
      tempContainer.innerHTML = `
        <div style="width: 600px; height: 900px; font-family: Arial, sans-serif; padding: 20px; background: #ffffff; color: #000000; display: flex; flex-direction: column;">
          
          <!-- Logo at Top -->
          <div style="text-align: center; margin-bottom: 15px;">
            <img src="/logo2.png" alt="Logo" style="width: 250px; height: auto; display: block; margin: 0 auto;" onerror="this.style.display='none'"/>
          </div>

          <!-- Restaurant Info -->
          <div style="text-align: center; border-bottom: 3px solid #000; padding-bottom: 12px; margin-bottom: 15px;">
            <div style="font-size: 14px; color: #000; font-weight: 600; margin-bottom: 6px;">Repas Marocains Authentiques</div>
            <div style="font-size: 12px; color: #000; line-height: 1.4;">
              <div>123 Rue de la Cuisine, Casablanca</div>
              <div style="font-weight: bold; margin-top: 3px;">Tel: +212 5XX-XXXXXX</div>
            </div>
          </div>

          <!-- Order Code (No border) -->
          <div style="text-align: center; margin-bottom: 15px;">
            <span style="font-size: 20px; font-weight: bold; color: #000;">COMMANDE #${order.id}</span>
          </div>

          <!-- Customer Delivery Info with Date on Right -->
          <div style="background: #f8f8f8; padding: 15px; margin-bottom: 15px; border: 2px solid #000;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #666;">LIVRER A:</div>
              <div style="font-size: 12px; color: #000; font-weight: bold; text-align: right;">${new Date(order.created_at).toLocaleDateString('fr-FR')}</div>
            </div>
            <div style="font-size: 18px; font-weight: bold; color: #000; margin-bottom: 8px;">${order.customer_name || 'N/A'}</div>
            <div style="font-size: 13px; color: #000; line-height: 1.4; margin-bottom: 6px;">${order.delivery_address || 'N/A'}</div>
            <div style="font-size: 15px; font-weight: bold; color: #000;">Tel: ${order.customer_phone || 'N/A'}</div>
          </div>

          <!-- QR Code -->
          <div style="text-align: center; margin-bottom: 15px; flex: 1; display: flex; flex-direction: column; justify-content: center;">
            <img src="${qrCode}" alt="QR Code" style="width: 200px; height: 200px; border: 3px solid #000; margin: 0 auto; display: block;"/>
            <div style="font-size: 12px; margin-top: 8px; font-weight: bold; color: #000;">SCANNER POUR DETAILS COMMANDE</div>
          </div>

          <!-- EAN13 Barcode -->
          <div style="text-align: center; border-top: 3px solid #000; padding-top: 15px;">
            <img src="${barcode}" alt="Barcode EAN13" style="width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto;"/>
          </div>
        </div>
      `;

      // Wait for images to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Convert to canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        width: 600,
        height: 900,
        useCORS: true,
        allowTaint: true,
      });

      // Create PDF in 4x6 inch format (sticker)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [4, 6],
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 4, 6);
      pdf.save(`Etiquette-${order.id}.pdf`);

      // Cleanup
      document.body.removeChild(iframe);
      console.log('Sticker label downloaded successfully');
    } catch (error: any) {
      console.error('Error generating label:', error);
      alert(
        `Erreur: ${error.message || "Impossible de generer l'etiquette"}`
      );
    }
  };

  return (
    <Button
      onClick={downloadLabel}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Télécharger Étiquette
    </Button>
  );
}
