// Show Modals
function showUploadModal() {
    new bootstrap.Modal(document.getElementById('uploadModal')).show();
}
function showCreateModal() {
    new bootstrap.Modal(document.getElementById('createModal')).show();
}
function showConvertModal() {
    new bootstrap.Modal(document.getElementById('convertModal')).show();
}

// Generate PDF from Text/Images
async function generatePDF() {
    const { PDFDocument, rgb } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([550, 750]);
    const text = document.getElementById('pdfText').value;
    
    // Add text
    page.drawText(text, { x: 50, y: 700, size: 12, color: rgb(0, 0, 0) });
    
    // Add image (if uploaded)
    const imageFile = document.getElementById('imageUpload').files[0];
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const imageBytes = new Uint8Array(e.target.result);
            const image = await pdfDoc.embedPng(imageBytes);
            page.drawImage(image, { x: 50, y: 500, width: 200, height: 200 });
            savePDF(pdfDoc);
        };
        reader.readAsArrayBuffer(imageFile);
    } else {
        savePDF(pdfDoc);
    }
}

// Save PDF
async function savePDF(pdfDoc) {
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'generated.pdf');
}

// Convert PDF to Other Formats (Mock Function - Use CloudConvert API for real)
async function convertPDF() {
    const format = document.getElementById('convertFormat').value;
    alert(`This would convert PDF to ${format} (real API needed)`);
}

// OCR Text Extraction
async function extractTextFromImage() {
    const imageFile = document.getElementById('imageUpload').files[0];
    if (!imageFile) return;
    
    const { data: { text } } = await Tesseract.recognize(imageFile, 'eng');
    document.getElementById('pdfText').value = text;
}