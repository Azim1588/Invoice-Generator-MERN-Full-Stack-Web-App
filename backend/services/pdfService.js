const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  generateInvoicePDF(invoice, customer, businessProfile = null, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ 
          size: 'A4', 
          margin: 50,
          bufferPages: true
        });

        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        // Define colors based on business profile branding
        const colors = {
          primary: businessProfile?.branding?.primaryColor || '#F97316',
          text: '#1e293b',
          textLight: '#64748b',
          border: '#e5e7eb',
          tableHeader: businessProfile?.branding?.primaryColor || '#F97316',
          tableHeaderText: '#fff',
        };

        // Use safe font names that PDFKit supports
        const fontFamily = this.getSafeFontName(businessProfile?.branding?.fontFamily || 'Helvetica');

        // 1. Logo (top right)
        this.addLogo(doc, colors, businessProfile?.logo?.path, options.logoPath);
        
        // 2. Your business info (top left)
        this.addBusinessInfo(doc, invoice, businessProfile, colors, fontFamily);
        
        // 3 & 4. Bill to (left) and Invoice details (right)
        this.addBillToAndInvoiceDetails(doc, invoice, customer, colors, fontFamily);
        
        // 5. Itemized table
        this.addItemsTable(doc, invoice, colors, fontFamily);
        
        // 6. Summary (Subtotal, Tax, Total)
        this.addSummary(doc, invoice, colors, fontFamily);

        // 7. Terms and conditions
        this.addTerms(doc, invoice, colors, fontFamily);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Helper method to get safe font names that PDFKit supports
  getSafeFontName(fontFamily) {
    const safeFonts = {
      'Helvetica': 'Helvetica',
      'Arial': 'Helvetica', // PDFKit doesn't have Arial, use Helvetica
      'Times New Roman': 'Times-Roman',
      'Georgia': 'Times-Roman', // Use Times-Roman as fallback
      'Verdana': 'Helvetica' // Use Helvetica as fallback
    };
    
    return safeFonts[fontFamily] || 'Helvetica';
  }

  addLogo(doc, colors, logoPath, fallbackLogoPath = null) {
    const logoToUse = logoPath || fallbackLogoPath;
    
    if (logoToUse && fs.existsSync(logoToUse)) {
      try {
        // Get image dimensions
        const img = doc.openImage(logoToUse);
        const aspectRatio = img.width / img.height;
        const maxWidth = 120;
        const maxHeight = 80;
        
        let logoWidth = maxWidth;
        let logoHeight = maxWidth / aspectRatio;
        
        if (logoHeight > maxHeight) {
          logoHeight = maxHeight;
          logoWidth = maxHeight * aspectRatio;
        }
        
        doc.image(logoToUse, 450, 30, { width: logoWidth });
      } catch (error) {
        console.log('Error loading logo, using placeholder:', error.message);
        this.addLogoPlaceholder(doc, colors);
      }
    } else {
      this.addLogoPlaceholder(doc, colors);
    }
  }

  addLogoPlaceholder(doc, colors) {
    // Placeholder circle with "Your logo"
    doc.save();
    doc.circle(530, 50, 30).fill(colors.primary);
    doc.fillColor('#fff').fontSize(12).font('Helvetica-Bold')
      .text('Your logo', 500, 43, { width: 60, align: 'center' });
    doc.restore();
  }

  addBusinessInfo(doc, invoice, businessProfile, colors, fontFamily) {
    const businessName = businessProfile?.businessName || invoice.senderName || 'Your Business Name';
    const businessAddress = businessProfile?.fullBusinessAddress || invoice.senderAddress || 'Your Business Address';
    const businessPhone = businessProfile?.businessPhone || invoice.senderPhone || 'Your Phone Number';
    const businessEmail = businessProfile?.businessEmail || invoice.senderEmail || 'your@email.com';

    doc.fontSize(24).font('Helvetica-Bold').fill(colors.text).text('INVOICE', 40, 40);
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica-Bold').fill(colors.primary).text(businessName, 40, 75);
    doc.fontSize(10).font(fontFamily).fill(colors.text)
      .text(businessAddress, 40, 95)
      .text(businessPhone, 40, 110)
      .text(businessEmail, 40, 125);
  }

  addBillToAndInvoiceDetails(doc, invoice, customer, colors, fontFamily) {
    // Bill to (left)
    doc.fontSize(10).font('Helvetica-Bold').fill(colors.text).text('Bill to:', 40, 160);
    doc.font(fontFamily).fill(colors.text)
      .text(customer.name || 'Customer Name', 40, 175)
      .text(customer.fullAddress || 'Customer Address', 40, 190)
      .text(customer.phone || 'Customer Phone', 40, 205)
      .text(customer.email || 'customer@email.com', 40, 220);

    // Invoice details (right)
    const rightX = 320;
    doc.fontSize(10).font('Helvetica-Bold').fill(colors.text)
      .text('Invoice number:', rightX, 160)
      .font(fontFamily).fill(colors.text).text(invoice.invoiceNumber || '##########', rightX + 100, 160)
      .font('Helvetica-Bold').fill(colors.text).text('Invoice date:', rightX, 175)
      .font(fontFamily).fill(colors.text).text(invoice.date ? this.formatDate(invoice.date) : 'MM/DD/YYYY', rightX + 100, 175)
      .font('Helvetica-Bold').fill(colors.text).text('Payment due:', rightX, 190)
      .font(fontFamily).fill(colors.text).text(invoice.dueDate ? this.formatDate(invoice.dueDate) : 'MM/DD/YYYY', rightX + 100, 190)
      .font('Helvetica-Bold').fill(colors.text).text('Status:', rightX, 205)
      .font(fontFamily).fill(colors.text).text(invoice.status || 'pending', rightX + 100, 205);
  }

  addItemsTable(doc, invoice, colors, fontFamily) {
    const tableTop = 260;
    const colX = [40, 250, 350, 450, 540]; // Item, Quantity, Price, Amount
    
    // Table header
    doc.rect(colX[0], tableTop, colX[4] - colX[0], 28).fill(colors.tableHeader);
    doc.fillColor(colors.tableHeaderText).fontSize(11).font('Helvetica-Bold');
    doc.text('Item', colX[0] + 8, tableTop + 8, { width: colX[1] - colX[0] - 8 });
    doc.text('Quantity', colX[1], tableTop + 8, { width: colX[2] - colX[1] });
    doc.text('Price per unit', colX[2], tableTop + 8, { width: colX[3] - colX[2] });
    doc.text('Amount', colX[3], tableTop + 8, { width: colX[4] - colX[3] });
    
    // Table rows
    let y = tableTop + 28;
    doc.font(fontFamily).fontSize(10).fill(colors.text);
    
    (invoice.items || []).forEach((item, i) => {
      const rowHeight = 24;
      doc.rect(colX[0], y, colX[4] - colX[0], rowHeight).fill(i % 2 === 0 ? '#fff' : '#f8fafc');
      doc.fillColor(colors.text)
        .text(item.description || `Item ${i + 1}`, colX[0] + 8, y + 8, { width: colX[1] - colX[0] - 8 })
        .text(item.quantity != null ? item.quantity.toString() : '#', colX[1], y + 8, { width: colX[2] - colX[1], align: 'center' })
        .text(item.unitPrice != null ? `$${item.unitPrice.toFixed(2)}` : '$0.00', colX[2], y + 8, { width: colX[3] - colX[2], align: 'right' })
        .text(item.total != null ? `$${item.total.toFixed(2)}` : '$0.00', colX[3], y + 8, { width: colX[4] - colX[3], align: 'right' });
      y += rowHeight;
    });
    
    // Draw border under table
    doc.moveTo(colX[0], y).lineTo(colX[4], y).strokeColor(colors.border).lineWidth(1).stroke();
    doc.y = y + 10;
  }

  addSummary(doc, invoice, colors, fontFamily) {
    const x = 320;
    let y = doc.y + 20;
    doc.fontSize(11).font(fontFamily).fill(colors.text);
    
    // Subtotal
    doc.text('Subtotal', x, y, { width: 100 });
    doc.text(invoice.subtotal != null ? `$${invoice.subtotal.toFixed(2)}` : '$0.00', x + 120, y, { align: 'right' });
    y += 18;
    
    // Tax
    const taxRate = invoice.taxRate || 0.1;
    doc.text(`Tax (${(taxRate * 100).toFixed(1)}%)`, x, y, { width: 100 });
    doc.text(invoice.tax != null ? `$${invoice.tax.toFixed(2)}` : '$0.00', x + 120, y, { align: 'right' });
    y += 18;
    
    // Discount (if any)
    if (invoice.discount && invoice.discount > 0) {
      doc.text('Discount', x, y, { width: 100 });
      doc.text(`-$${invoice.discount.toFixed(2)}`, x + 120, y, { align: 'right' });
      y += 18;
    }
    
    // Total
    y += 5;
    doc.rect(x, y, 180, 32).fill(colors.primary);
    doc.fillColor('#fff').font('Helvetica-Bold').fontSize(14)
      .text('TOTAL', x + 8, y + 8, { width: 100 })
      .text(invoice.total != null ? `$${invoice.total.toFixed(2)}` : '$0.00', x + 100, y + 8, { width: 72, align: 'right' });
    doc.y = y + 45;
  }

  addTerms(doc, invoice, colors, fontFamily) {
    let y = doc.y + 20;
    
    // Payment terms
    doc.fontSize(11).font('Helvetica-Bold').fill(colors.text).text('Payment Terms', 40, y);
    doc.font(fontFamily).fontSize(10).fill(colors.textLight)
      .text('Payment is due within 30 days of invoice date. Please include invoice number with payment.', 40, y + 16, { width: 300 });
    
    // Notes
    if (invoice.notes) {
      y += 50;
      doc.fontSize(11).font('Helvetica-Bold').fill(colors.text).text('Notes', 40, y);
      doc.font(fontFamily).fontSize(10).fill(colors.textLight)
        .text(invoice.notes, 40, y + 16, { width: 300 });
    }
    
    // Footer
    y += 60;
    doc.fontSize(9).font(fontFamily).fill(colors.textLight)
      .text('Thank you for your business!', 40, y, { width: 300, align: 'center' });
  }

  formatDate(date) {
    const d = new Date(date);
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
  }
}

module.exports = new PDFService(); 