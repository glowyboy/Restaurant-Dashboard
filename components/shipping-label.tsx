'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';
import Barcode from 'react-barcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { type Order } from '@/lib/supabase';

interface ShippingLabelProps {
  order: Order;
}

export function ShippingLabel({ order }: ShippingLabelProps) {
  const labelRef = useRef<HTMLDivElement>(null);

  const generateQRCode = async () => {
    const orderData = {
      id: order.id,
      customer: order.customer_name || 'Client',
      phone: order.customer_phone || 'N/A',
      address: order.delivery_address || 'Adresse non fournie',
      items: order.items || [],
      total: order.total,
      date: order.created_at,
    };
    
    try {
      const qrDataUrl = await QRCode.toDataURL(JSON.stringify(orderData), {
        width: 200,
        margin: 1,
        errorCorrectionLevel: 'M',
      });
      return qrDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }
  };

  const downloadLabel = async () => {
    console.log('Download label clicked for order:', order.id);
    
    try {
      // Generate QR code
      const qrCode = await generateQRCode();
      console.log('QR code generated');
      
      // Create an iframe to isolate styles
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.width = '800px';
      iframe.style.height = '1200px';
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Cannot access iframe document');
      
      // Add basic styles to iframe
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: white; padding: 40px; font-family: Arial, sans-serif; }
          </style>
        </head>
        <body></body>
        </html>
      `);
      iframeDoc.close();
      
      const tempContainer = iframeDoc.body;

      // Build the label HTML
      tempContainer.innerHTML = `
        <div style="font-family: Arial, sans-serif; border: 3px solid #000; padding: 30px; background: #ffffff; color: #000000;">
          <!-- Header with Logo -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px;">
            <div>
              <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #d32f2f;">LAMSALNA</h1>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Repas Marocains Authentiques</p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 18px; font-weight: bold; color: #000;">COMMANDE #${order.id}</div>
              <div style="font-size: 14px; margin-top: 5px; color: #666;">${new Date(order.created_at).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

          <!-- Customer Info -->
          <div style="margin-bottom: 30px; background: #f5f5f5; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; color: #666;">LIVRER À:</div>
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #000;">${order.customer_name || 'N/A'}</div>
            <div style="font-size: 18px; margin-bottom: 8px; color: #000;">📍 ${order.delivery_address || 'N/A'}</div>
            <div style="font-size: 18px; color: #000;">📞 ${order.customer_phone || 'N/A'}</div>
          </div>

          <!-- Order Items -->
          <div style="margin-bottom: 30px;">
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; color: #666;">CONTENU:</div>
            ${(order.items || []).map(item => `
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd;">
                <div style="font-size: 16px; color: #000;">${item.quantity || 1}x ${item.dish_name || 'Plat'}</div>
                <div style="font-size: 16px; font-weight: bold; color: #000;">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
              </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; padding: 15px 0; margin-top: 10px; border-top: 2px solid #000;">
              <div style="font-size: 20px; font-weight: bold; color: #000;">TOTAL:</div>
              <div style="font-size: 24px; font-weight: bold; color: #d32f2f;">$${Number(order.total || 0).toFixed(2)}</div>
            </div>
          </div>

          <!-- Barcodes Section -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding-top: 30px; border-top: 2px solid #000;">
            <!-- QR Code -->
            <div style="text-align: center;">
              <img src="${qrCode}" alt="QR Code" style="width: 180px; height: 180px; border: 2px solid #000;"/>
              <div style="font-size: 12px; margin-top: 10px; font-weight: bold; color: #000;">SCANNER POUR DÉTAILS</div>
            </div>

            <!-- Barcode -->
            <div style="text-align: center; flex: 1; margin-left: 30px;">
              <div id="barcode-container"></div>
              <div style="font-size: 16px; margin-top: 10px; font-weight: bold; letter-spacing: 2px; color: #000;">ORDER-${String(order.id).padStart(8, '0')}</div>
            </div>
          </div>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #000; text-align: center; font-size: 12px; color: #666;">
            <div>Repas marocains authentiques • Préparés avec amour</div>
            <div style="margin-top: 5px;">www.lamsalna.com • info@lamsalna.com</div>
          </div>
        </div>
      `;

      // Add barcode using simple SVG
      const barcodeContainer = tempContainer.querySelector('#barcode-container');
      if (barcodeContainer) {
        const barcodeValue = `ORDER${String(order.id).padStart(8, '0')}`;
        const barcodeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        barcodeContainer.appendChild(barcodeSvg);
        
        // Simple barcode generation
        barcodeSvg.setAttribute('width', '400');
        barcodeSvg.setAttribute('height', '80');
        barcodeSvg.setAttribute('style', 'background: #ffffff;');
        barcodeSvg.innerHTML = `
          <rect width="400" height="80" fill="#ffffff"/>
          <text x="200" y="40" text-anchor="middle" font-size="32" font-family="monospace" font-weight="bold" fill="#000000">${barcodeValue}</text>
          <rect x="20" y="50" width="3" height="25" fill="#000000"/>
          <rect x="26" y="50" width="1" height="25" fill="#000000"/>
          <rect x="30" y="50" width="3" height="25" fill="#000000"/>
          <rect x="36" y="50" width="1" height="25" fill="#000000"/>
          <rect x="40" y="50" width="2" height="25" fill="#000000"/>
          <rect x="45" y="50" width="3" height="25" fill="#000000"/>
          <rect x="51" y="50" width="1" height="25" fill="#000000"/>
          <rect x="55" y="50" width="2" height="25" fill="#000000"/>
          <rect x="60" y="50" width="3" height="25" fill="#000000"/>
          <rect x="66" y="50" width="1" height="25" fill="#000000"/>
          <rect x="70" y="50" width="3" height="25" fill="#000000"/>
          <rect x="76" y="50" width="2" height="25" fill="#000000"/>
          <rect x="81" y="50" width="1" height="25" fill="#000000"/>
          <rect x="85" y="50" width="3" height="25" fill="#000000"/>
        `;
      }

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Convert to canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        ignoreElements: (element) => {
          // Ignore elements with oklch colors
          const computedStyle = window.getComputedStyle(element);
          return computedStyle.color?.includes('oklch') || 
                 computedStyle.backgroundColor?.includes('oklch') ||
                 computedStyle.borderColor?.includes('oklch');
        },
        onclone: (clonedDoc) => {
          // Force all colors to be standard hex
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el: any) => {
            if (el.style) {
              // Remove any oklch colors
              if (el.style.color?.includes('oklch')) el.style.color = '#000000';
              if (el.style.backgroundColor?.includes('oklch')) el.style.backgroundColor = '#ffffff';
              if (el.style.borderColor?.includes('oklch')) el.style.borderColor = '#000000';
            }
          });
        },
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Etiquette-Commande-${order.id}.pdf`);

      // Cleanup
      document.body.removeChild(iframe);
      console.log('Label downloaded successfully');
    } catch (error: any) {
      console.error('Error generating label:', error);
      alert(`Erreur: ${error.message || 'Impossible de générer l\'étiquette'}`);
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
