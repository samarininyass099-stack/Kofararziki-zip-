// VTU Card Generator JavaScript

// Set today's date as default
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('purchaseDate').value = today;
});

// Generate Card
function generateCard() {
    const vtuNumber = document.getElementById('vtuNumber').value.trim();
    const provider = document.getElementById('provider').value;
    const amount = document.getElementById('amount').value.trim();
    const validity = document.getElementById('validity').value;
    const pin = document.getElementById('pin').value.trim();
    const purchaseDate = document.getElementById('purchaseDate').value;
    const referenceNo = document.getElementById('referenceNo').value.trim() || 'REF' + Date.now();

    // Validation
    if (!vtuNumber || !amount || !pin) {
        alert('Please fill in all required fields (VTU Number, Amount, PIN)');
        return;
    }

    // Update card display
    document.getElementById('displayVTU').textContent = formatVTUNumber(vtuNumber);
    document.getElementById('displayAmount').textContent = formatCurrency(amount);
    document.getElementById('displayPIN').textContent = maskPIN(pin);
    document.getElementById('displayValidity').textContent = validity;
    document.getElementById('displayDate').textContent = formatDate(purchaseDate);
    document.getElementById('displayRef').textContent = referenceNo;

    // Update provider display
    document.querySelector('.card-provider').textContent = provider;

    // Show success message
    showNotification('Card generated successfully!', 'success');
}

// Format VTU Number
function formatVTUNumber(vtu) {
    const clean = vtu.replace(/\D/g, '');
    return clean.replace(/(\d{4})/g, '$1 ').trim();
}

// Format Currency
function formatCurrency(amount) {
    const num = parseFloat(amount.replace(/\D/g, '')) || 0;
    return '₦' + num.toLocaleString('en-NG');
}

// Mask PIN (show last 4 digits)
function maskPIN(pin) {
    const digits = pin.replace(/\D/g, '');
    if (digits.length === 0) return '****-****-****';
    const lastFour = digits.slice(-4);
    return '*'.repeat(4) + '-' + '*'.repeat(4) + '-' + lastFour;
}

// Format Date
function formatDate(dateString) {
    if (!dateString) return new Date().toLocaleDateString('en-NG');
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-NG', options);
}

// Reset Form
function resetForm() {
    document.getElementById('vtuForm').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('purchaseDate').value = today;
    
    // Reset card to default
    document.getElementById('displayVTU').textContent = '234812345678';
    document.getElementById('displayAmount').textContent = '₦1,000';
    document.getElementById('displayPIN').textContent = '****-****-****';
    document.getElementById('displayValidity').textContent = '30 Days';
    document.getElementById('displayDate').textContent = today;
    document.getElementById('displayRef').textContent = 'REF123456';
    document.querySelector('.card-provider').textContent = 'MTN';
}

// Print Card
function printCard() {
    if (!document.getElementById('vtuNumber').value) {
        alert('Please generate a card first before printing');
        return;
    }
    window.print();
}

// Download PDF (using basic implementation)
function downloadPDF() {
    const element = document.getElementById('cardPreview');
    if (!element.querySelector('.vtu-card').style.visibility === 'hidden') {
        alert('Please generate a card first');
        return;
    }
    
    // Create a simple PDF-like experience using print
    alert('Use your browser\'s Print to PDF feature:\n1. Click Print\n2. Select "Save as PDF"\n3. Set size to 4x6 inches');
    window.print();
}

// Download as ZIP
async function downloadZIP() {
    const vtuNumber = document.getElementById('vtuNumber').value.trim();
    
    if (!vtuNumber) {
        alert('Please generate a card first');
        return;
    }

    // Collect card data
    const cardData = {
        vtuNumber: vtuNumber,
        provider: document.getElementById('provider').value,
        amount: document.getElementById('amount').value,
        validity: document.getElementById('validity').value,
        pin: document.getElementById('pin').value,
        purchaseDate: document.getElementById('purchaseDate').value,
        referenceNo: document.getElementById('referenceNo').value,
        generatedAt: new Date().toISOString()
    };

    // Create HTML card content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>VTU Card - ${cardData.referenceNo}</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="print.css" media="print">
</head>
<body>
    <div class="card-preview">
        <div class="vtu-card">
            <div class="card-header">
                <div class="card-logo">VTU</div>
                <div class="card-provider">${cardData.provider}</div>
            </div>
            <div class="card-body">
                <div class="card-field">
                    <span class="field-label">VTU Number</span>
                    <span class="field-value">${formatVTUNumber(cardData.vtuNumber)}</span>
                </div>
                <div class="card-field">
                    <span class="field-label">Amount</span>
                    <span class="field-value amount">${formatCurrency(cardData.amount)}</span>
                </div>
                <div class="card-field">
                    <span class="field-label">PIN</span>
                    <span class="field-value pin">${maskPIN(cardData.pin)}</span>
                </div>
                <div class="card-field">
                    <span class="field-label">Validity</span>
                    <span class="field-value">${cardData.validity}</span>
                </div>
            </div>
            <div class="card-footer">
                <div class="footer-item">
                    <span class="footer-label">Date</span>
                    <span class="footer-value">${formatDate(cardData.purchaseDate)}</span>
                </div>
                <div class="footer-item">
                    <span class="footer-label">Ref No</span>
                    <span class="footer-value">${cardData.referenceNo}</span>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim();

    // Create CSV data
    const csvContent = `VTU Card Data Export\n\nGenerated: ${new Date().toLocaleString()}\n\nField,Value\nVTU Number,${cardData.vtuNumber}\nProvider,${cardData.provider}\nAmount,${cardData.amount}\nValidity,${cardData.validity}\nPIN,${cardData.pin}\nPurchase Date,${cardData.purchaseDate}\nReference No,${cardData.referenceNo}\n`;

    // Create JSON file
    const jsonContent = JSON.stringify(cardData, null, 2);

    // Create ZIP (simplified - downloads as individual files)
    try {
        // Download JSON
        downloadFile(jsonContent, `vtu-card-${cardData.referenceNo}.json`, 'application/json');
        
        // Download HTML
        downloadFile(htmlContent, `vtu-card-${cardData.referenceNo}.html`, 'text/html');
        
        // Download CSV
        downloadFile(csvContent, `vtu-card-${cardData.referenceNo}.csv`, 'text/csv');

        showNotification('Files downloaded successfully! (JSON, HTML, CSV)', 'success');
    } catch (error) {
        console.error('Download error:', error);
        showNotification('Error downloading files', 'error');
    }
}

// Helper function to download files
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// Toggle PIN Visibility
function togglePINVisibility() {
    const pinElement = document.getElementById('displayPIN');
    const pinInput = document.getElementById('pin');
    
    if (pinElement.textContent.includes('*')) {
        // Show PIN
        pinElement.textContent = pinInput.value;
        showNotification('PIN Visible', 'info');
    } else {
        // Hide PIN
        pinElement.textContent = maskPIN(pinInput.value);
        showNotification('PIN Hidden', 'info');
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    // Simple notification using alert (can be enhanced)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28A745' : type === 'error' ? '#DC3545' : '#17A2B8'};
        color: white;
        border-radius: 4px;
        z-index: 9999;
        animation: slideIn 0.3s ease-in-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
