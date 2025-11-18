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
      
      // Create a temporary container for the label
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '800px';
      tempContainer.style.background = 'white';
      tempContainer.style.padding = '40px';
      document.body.appendChild(tempContainer);

      // Build the label HTML
      tempContainer.innerHTML = `
        <div style="font-family: Arial, sans-serif; border: 3px solid #000; padding: 30px;">
          <!-- Header with Logo -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px;">
            <div>
              <img src="/logo.png" alt="Logo" style="height: 80px;" onerror="this.style.display='none'"/>
              <h1 style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold;">LAMSALNA</h1>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 18px; font-weight: bold;">COMMANDE #${order.id}</div>
              <div style="font-size: 14px; margin-top: 5px;">${new Date(order.created_at).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

          <!-- Customer Info -->
          <div style="margin-bottom: 30px; background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; color: #666;">LIVRER À:</div>
            <div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">${order.customer_name || 'N/A'}</div>
            <div style="font-size: 18px; margin-bottom: 8px;">📍 ${order.delivery_address || 'N/A'}</div>
            <div style="font-size: 18px;">📞 ${order.customer_phone || 'N/A'}</div>
          </div>

          <!-- Order Items -->
          <div style="margin-bottom: 30px;">
            <div style="font-size: 14px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; color: #666;">CONTENU:</div>
            ${(order.items || []).map(item => `
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd;">
                <div style="font-size: 16px;">${item.quantity || 1}x ${item.dish_name || 'Plat'}</div>
                <div style="font-size: 16px; font-weight: bold;">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</div>
              </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; padding: 15px 0; margin-top: 10px; border-top: 2px solid #000;">
              <div style="font-size: 20px; font-weight: bold;">TOTAL:</div>
              <div style="font-size: 24px; font-weight: bold; color: #d32f2f;">$${Number(order.total || 0).toFixed(2)}</div>
            </div>
          </div>

          <!-- Barcodes Section -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding-top: 30px; border-top: 2px solid #000;">
            <!-- QR Code -->
            <div style="text-align: center;">
              <img src="${qrCode}" alt="QR Code" style="width: 180px; height: 180px; border: 2px solid #000;"/>
              <div style="font-size: 12px; margin-top: 10px; font-weight: bold;">SCANNER POUR DÉTAILS</div>
            </div>

            <!-- Barcode -->
            <div style="text-align: center; flex: 1; margin-left: 30px;">
              <div id="barcode-container"></div>
              <div style="font-size: 16px; margin-top: 10px; font-weight: bold; letter-spacing: 2px;">ORDER-${String(order.id).padStart(8, '0')}</div>
            </div>
          </div>

          <!-- Footer -->
          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #000; text-align: center; font-size: 12px; color: #666;">
            <div>Repas marocains authentiques • Préparés avec amour</div>
            <div style="margin-top: 5px;">www.lamsalna.com • info@lamsalna.com</div>
          </div>
        </div>
      `;

      // Add barcode using react-barcode
      const barcodeContainer = tempContainer.querySelector('#barcode-container');
      if (barcodeContainer) {
        const barcodeValue = `ORDER${String(order.id).padStart(8, '0')}`;
        const barcodeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        barcodeContainer.appendChild(barcodeSvg);
        
        // Simple barcode generation (you can enhance this)
        barcodeSvg.setAttribute('width', '400');
        barcodeSvg.setAttribute('height', '80');
        barcodeSvg.innerHTML = `
          <rect width="400" height="80" fill="white"/>
          <text x="200" y="40" text-anchor="middle" font-size="32" font-family="monospace" font-weight="bold">${barcodeValue}</text>
          <rect x="20" y="50" width="3" height="25" fill="black"/>
          <rect x="26" y="50" width="1" height="25" fill="black"/>
          <rect x="30" y="50" width="3" height="25" fill="black"/>
          <rect x="36" y="50" width="1" height="25" fill="black"/>
          <rect x="40" y="50" width="2" height="25" fill="black"/>
          <rect x="45" y="50" width="3" height="25" fill="black"/>
          <rect x="51" y="50" width="1" height="25" fill="black"/>
          <rect x="55" y="50" width="2" height="25" fill="black"/>
          <rect x="60" y="50" width="3" height="25" fill="black"/>
          <rect x="66" y="50" width="1" height="25" fill="black"/>
          <rect x="70" y="50" width="3" height="25" fill="black"/>
          <rect x="76" y="50" width="2" height="25" fill="black"/>
          <rect x="81" y="50" width="1" height="25" fill="black"/>
          <rect x="85" y="50" width="3" height="25" fill="black"/>
        `;
      }

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      // Convert to canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
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
      document.body.removeChild(tempContainer);
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
