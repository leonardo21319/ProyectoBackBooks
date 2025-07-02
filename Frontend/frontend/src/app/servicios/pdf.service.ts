// ============================================
// 📁 CREAR: src/app/servicios/pdf.service.ts
// ============================================

import { Injectable } from '@angular/core';
import { PaymentService } from './payment.service';

@Injectable({
  providedIn: 'root'
})
export class PDFService {

  constructor(private paymentService: PaymentService) {}

  // Descargar PDF y guardarlo automáticamente
  async downloadPDFTicket(orderId: string, fileName?: string): Promise<void> {
    try {
      console.log('PDFService: Iniciando descarga de PDF', orderId);
      
      const pdfBlob = await this.paymentService.downloadTicketPDF(orderId).toPromise();
      
      if (!pdfBlob) {
        throw new Error('No se pudo obtener el PDF');
      }

      // Crear URL del blob
      const url = window.URL.createObjectURL(pdfBlob);
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `ticket-compra-${orderId}.pdf`;
      
      // Agregar al DOM temporalmente y hacer clic
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('PDFService: PDF descargado exitosamente');
      
    } catch (error) {
      console.error('PDFService: Error descargando PDF', error);
      throw error;
    }
  }

  // Abrir PDF en nueva ventana
  async openPDFInNewWindow(orderId: string): Promise<void> {
    try {
      console.log('PDFService: Abriendo PDF en nueva ventana', orderId);
      
      const pdfBlob = await this.paymentService.downloadTicketPDF(orderId).toPromise();
      
      if (!pdfBlob) {
        throw new Error('No se pudo obtener el PDF');
      }

      const url = window.URL.createObjectURL(pdfBlob);
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        // Si el popup fue bloqueado, descargar en su lugar
        console.warn('PDFService: Popup bloqueado, descargando archivo');
        await this.downloadPDFTicket(orderId);
      }
      
    } catch (error) {
      console.error('PDFService: Error abriendo PDF', error);
      throw error;
    }
  }

  // Generar nombre de archivo personalizado
  generateFileName(orderId: string, customerName?: string): string {
    const date = new Date().toISOString().split('T')[0];
    const cleanName = customerName?.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() || 'compra';
    return `ticket-${cleanName}-${orderId}-${date}.pdf`;
  }

  // Verificar si el navegador soporta descargas
  isDownloadSupported(): boolean {
    return !!(document.createElement('a').download !== undefined);
  }

  // Mostrar preview del PDF (opcional)
  async previewPDF(orderId: string, containerId: string): Promise<void> {
    try {
      console.log('PDFService: Mostrando preview de PDF', orderId);
      
      const pdfBlob = await this.paymentService.downloadTicketPDF(orderId).toPromise();
      
      if (!pdfBlob) {
        throw new Error('No se pudo obtener el PDF');
      }

      const url = window.URL.createObjectURL(pdfBlob);
      const container = document.getElementById(containerId);
      
      if (container) {
        container.innerHTML = `
          <iframe 
            src="${url}" 
            width="100%" 
            height="600px" 
            style="border: none; border-radius: 8px;">
          </iframe>
        `;
      }
      
    } catch (error) {
      console.error('PDFService: Error mostrando preview', error);
      throw error;
    }
  }
}