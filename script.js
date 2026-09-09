// KofarArziki Data - VTU Card Generator
// Professional VTU Data Card Generator and Printing System for Nigeria

// ============ GLOBAL STATE ============
let generatedCards = [];
let pinVisible = false;
let currentSerialCounter = 1;

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('purchaseDate').value = today;
    
    // Load saved data from localStorage
    loadData();
    
    // Update storage info
    updateStorageInfo();
    
    // Add event listeners for real-time validation
    document.getElementById('vtuNumber').addEventListener('input', validateVTUNumber);
    document.getElementById('pin').addEventListener('input', validatePIN);
    document.getElementById('amount').addEventListener('input', validateAmount);
});

// ============ VALIDATION FUNCTIONS ============
function validateVTUNumber(e) {
    const value = e.target.value.trim();
    const cleaned = value.replace(/\D/g, '');
    
    if (value && cleaned.length < 11) {
        e.target.style.borderColor = '#DC3545';
    } else if (cleaned.length > 13) {
        e.target.style.borderColor = '#DC3545';
    } else if (cleaned.length >= 11 && cleaned.length <= 13) {
        e.target.style.borderColor = '#28A745';
    } else {
        e.target.style.borderColor = '';
    }
}

function validatePIN(e) {
    const value = e.target.value.trim();
    const cleaned = value.replace(/\D/g, '');
    
    if (value && cleaned.length < 12) {
        e.target.style.borderColor = '#DC3545';
    } else if (cleaned.length > 12) {
        e.target.value = cleaned.substring(0, 12);
        e.target.style.borderColor = '#28A745';
    } else if (cleaned.length === 12) {
        e.target.style.borderColor = '#28A745';
    } else {
        e.target.style.borderColor = '';
    }
}

function validateAmount(e) {
    const value = e.target.value;
    
    if (value && (isNaN(value) || parseInt(value) < 1)) {
        e.target.style.borderColor = '#DC3545';
    } else if (value) {
        e.target.style.borderColor = '#28A745';
    } else {
        e.target.style.borderColor = '';
    }
}

function validateForm() {
    const vtuNumber = document.getElementById('vtuNumber').value.trim();
    const provider = document.getElementById('provider').value;
    const amount = document.getElementById('amount').value.trim();
    const pin = document.getElementById('pin').value.trim();
    const validity = document.getElementById('validity').value;
    const purchaseDate = document.getElementById('purchaseDate').value;
    
    // Check required fields
    if (!vtuNumber) {
        showNotification('❌ VTU Number is required', 'error');
        return false;
    }
    
    if (!provider) {
        showNotification('❌ Please select a Network Provider', 'error');
        return false;
    }
    
    if (!amount) {
        showNotification('❌ Data Amount is required', 'error');
        return false;
    }
    
    if (isNaN(amount) || parseInt(amount) < 1) {
        showNotification('❌ Data Amount must be a valid number greater than 0', 'error');
        return false;
    }
    
    if (!pin) {
        showNotification('❌ PIN is required', 'error');
        return false;
    }
    
    // Validate VTU Number
    const cleanVTU = vtuNumber.replace(/\D/g, '');
    if (cleanVTU.length < 11 || cleanVTU.length > 13) {
        showNotification('❌ VTU Number must be 11-13 digits', 'error');
        return false;
    }
    
    // Validate PIN
    const cleanPIN = pin.replace(/\D/g, '');
    if (cleanPIN.length !== 12) {
        showNotification('❌ PIN must be exactly 12 digits', 'error');
        return false;
    }
    
    if (!validity) {
        showNotification('❌ Please select a Validity period', 'error');
        return false;
    }
    
    if (!purchaseDate) {
        showNotification('❌ Purchase Date is required', 'error');
        return false;
    }
    
    return true;
}

// ============ CARD GENERATION ============
function generateCard() {
    if (!validateForm()) {
        return;
    }
    
    const vtuNumber = document.getElementById('vtuNumber').value.trim();
    const provider = document.getElementById('provider').value;
    const amount = document.getElementById('amount').value.trim();
    const validity = document.getElementById('validity').value;
    const pin = document.getElementById('pin').value.trim();
    const purchaseDate = document.getElementById('purchaseDate').value;
    let serialNumber = document.getElementById('serialNumber').value.trim();
    
    // Generate serial number if not provided
    if (!serialNumber) {
        serialNumber = `KZD-${new Date().getFullYear()}-${String(currentSerialCounter).padStart(5, '0')}`;
        currentSerialCounter++;
    }
    
    const cardData = {
        vtuNumber: vtuNumber,
        provider: provider,
        amount: amount,
        validity: validity,
        pin: pin,
        purchaseDate: purchaseDate,
        serialNumber: serialNumber,
        generatedAt: new Date().toISOString()
    };
    
    generatedCards = [cardData];
    displayCards();
    saveData();
    
    showNotification('✅ Card generated successfully!', 'success');
}

function generateMultipleCards(cardsArray) {
    if (!Array.isArray(cardsArray) || cardsArray.length === 0) {
        showNotification('❌ Invalid cards array', 'error');
        return false;
    }
    
    const validatedCards = [];
    
    for (let i = 0; i < cardsArray.length; i++) {
        const card = cardsArray[i];
        
        // Validate required fields
        if (!card.vtuNumber || !card.provider || !card.amount || !card.pin || !card.validity || !card.purchaseDate) {
            showNotification(`❌ Record ${i + 1}: Missing required fields`, 'error');
            return false;
        }
        
        // Validate VTU Number
        const cleanVTU = card.vtuNumber.toString().replace(/\D/g, '');
        if (cleanVTU.length < 11 || cleanVTU.length > 13) {
            showNotification(`❌ Record ${i + 1}: Invalid VTU Number (must be 11-13 digits)`, 'error');
            return false;
        }
        
        // Validate PIN
        const cleanPIN = card.pin.toString().replace(/\D/g, '');
        if (cleanPIN.length !== 12) {
            showNotification(`❌ Record ${i + 1}: Invalid PIN (must be 12 digits)`, 'error');
            return false;
        }
        
        // Validate provider
        const validProviders = ['MTN', 'Airtel', 'Glo', '9mobile'];
        if (!validProviders.includes(card.provider)) {
            showNotification(`❌ Record ${i + 1}: Invalid provider. Must be MTN, Airtel, Glo, or 9mobile`, 'error');
            return false;
        }
        
        // Validate amount
        if (isNaN(card.amount) || parseInt(card.amount) < 1) {
            showNotification(`❌ Record ${i + 1}: Invalid amount (must be a positive number)`, 'error');
            return false;
        }
        
        // Add serial number if not provided
        if (!card.serialNumber) {
            card.serialNumber = `KZD-${new Date().getFullYear()}-${String(currentSerialCounter).padStart(5, '0')}`;
            currentSerialCounter++;
        }
        
        card.generatedAt = new Date().toISOString();
        validatedCards.push(card);
    }
    
    generatedCards = validatedCards;
    displayCards();
    saveData();
    
    showNotification(`✅ ${validatedCards.length} card(s) generated successfully!`, 'success');
    return true;
}

// ============ CARD DISPLAY ============
function displayCards() {
    const preview = document.getElementById('cardPreview');
    
    if (generatedCards.length === 0) {
        preview.innerHTML = `
            <div class="no-card-message">
                <p>No card generated yet.</p>
                <p>Fill the form and click "Generate Card" to create a VTU data card.</p>
            </div>
        `;
        document.getElementById('cardCount').innerHTML = '';
        return;
    }
    
    let cardsHTML = '';
    
    generatedCards.forEach((card, index) => {
        const formattedVTU = formatVTUNumber(card.vtuNumber);
        const formattedAmount = formatAmount(card.amount);
        const maskedPIN = maskPIN(card.pin);
        const formattedDate = formatDate(card.purchaseDate);
        
        cardsHTML += `
            <div class="vtu-card" data-card-index="${index}">
                <div class="card-header">
                    <div class="card-logo">KZD</div>
                    <div class="card-provider">${card.provider}</div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="field-label">VTU Number</span>
                        <span class="field-value">${formattedVTU}</span>
                    </div>
                    <div class="card-field">
                        <span class="field-label">Data Bundle</span>
                        <span class="field-value amount">${formattedAmount}</span>
                    </div>
                    <div class="card-field">
                        <span class="field-label">PIN</span>
                        <span class="field-value pin" data-pin="${card.pin}">${maskedPIN}</span>
                    </div>
                    <div class="card-field">
                        <span class="field-label">Validity</span>
                        <span class="field-value">${card.validity}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="footer-item">
                        <span class="footer-label">Date</span>
                        <span class="footer-value">${formattedDate}</span>
                    </div>
                    <div class="footer-item">
                        <span class="footer-label">Serial</span>
                        <span class="footer-value">${card.serialNumber}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    preview.innerHTML = cardsHTML;
    
    const cardText = generatedCards.length === 1 ? 'card' : 'cards';
    document.getElementById('cardCount').innerHTML = `<strong>${generatedCards.length} ${cardText} generated</strong>`;
}

// ============ FORMATTING FUNCTIONS ============
function formatVTUNumber(vtu) {
    const clean = vtu.toString().replace(/\D/g, '');
    return clean.replace(/(\d{4})/g, '$1 ').trim();
}

function formatAmount(amount) {
    const num = parseInt(amount) || 0;
    
    if (num >= 1024) {
        const gb = (num / 1024).toFixed(1);
        return `${gb}GB`;
    }
    
    return `${num}MB`;
}

function maskPIN(pin) {
    const digits = pin.toString().replace(/\D/g, '');
    if (digits.length === 0) return '****-****-****';
    const lastFour = digits.slice(-4);
    return '*'.repeat(4) + '-' + '*'.repeat(4) + '-' + lastFour;
}

function formatDate(dateString) {
    if (!dateString) return new Date().toLocaleDateString('en-NG');
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-NG', options);
}

// ============ FORM MANAGEMENT ============
function resetForm() {
    document.getElementById('vtuForm').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('purchaseDate').value = today;
    
    // Reset validation colors
    document.getElementById('vtuNumber').style.borderColor = '';
    document.getElementById('pin').style.borderColor = '';
    document.getElementById('amount').style.borderColor = '';
    
    showNotification('✓ Form cleared', 'info');
}

// ============ JSON IMPORT/EXPORT ============
function importJSON() {
    const fileInput = document.getElementById('jsonFile');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showNotification('❌ Please select a JSON file', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            let data = JSON.parse(content);
            
            // Handle both array and object with cards array
            if (!Array.isArray(data)) {
                if (data.cards && Array.isArray(data.cards)) {
                    data = data.cards;
                } else {
                    showNotification('❌ JSON must contain an array of cards or an object with "cards" array', 'error');
                    return;
                }
            }
            
            if (generateMultipleCards(data)) {
                fileInput.value = '';
                showNotification(`✅ Successfully imported ${data.length} card(s)`, 'success');
            }
        } catch (error) {
            showNotification(`❌ Invalid JSON file: ${error.message}`, 'error');
            console.error('JSON parse error:', error);
        }
    };
    
    reader.readAsText(file);
}

function downloadTemplateJSON() {
    const template = [
        {
            "vtuNumber": "2348012345678",
            "provider": "MTN",
            "amount": "1000",
            "pin": "123456789012",
            "validity": "30 Days",
            "purchaseDate": "2026-09-08",
            "serialNumber": "KZD-2026-00001"
        },
        {
            "vtuNumber": "2348109876543",
            "provider": "Airtel",
            "amount": "500",
            "pin": "234567890123",
            "validity": "7 Days",
            "purchaseDate": "2026-09-08",
            "serialNumber": "KZD-2026-00002"
        }
    ];
    
    downloadFile(
        JSON.stringify(template, null, 2),
        'vtu-cards-template.json',
        'application/json'
    );
    
    showNotification('✓ Template downloaded', 'success');
}

function exportJSON() {
    if (generatedCards.length === 0) {
        showNotification('❌ No cards to export', 'error');
        return;
    }
    
    const data = {
        exportedAt: new Date().toISOString(),
        totalCards: generatedCards.length,
        cards: generatedCards
    };
    
    downloadFile(
        JSON.stringify(data, null, 2),
        `vtu-cards-${new Date().getTime()}.json`,
        'application/json'
    );
    
    showNotification('✓ Cards exported as JSON', 'success');
}

// ============ CSV EXPORT ============
function downloadCSV() {
    if (generatedCards.length === 0) {
        showNotification('❌ No cards to export', 'error');
        return;
    }
    
    let csv = 'VTU Number,Provider,Amount (MB),PIN,Validity,Purchase Date,Serial Number,Generated At\n';
    
    generatedCards.forEach(card => {
        const row = [
            card.vtuNumber,
            card.provider,
            card.amount,
            card.pin,
            card.validity,
            card.purchaseDate,
            card.serialNumber,
            card.generatedAt
        ].map(field => `"${field}"`).join(',');
        
        csv += row + '\n';
    });
    
    downloadFile(csv, `vtu-cards-${new Date().getTime()}.csv`, 'text/csv');
    showNotification('✓ Cards exported as CSV', 'success');
}

// ============ PDF DOWNLOAD ============
function downloadPDF() {
    if (generatedCards.length === 0) {
        showNotification('❌ No cards to export', 'error');
        return;
    }
    
    const htmlContent = generatePDFHTML();
    
    // Create a temporary iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    iframe.contentDocument.write(htmlContent);
    iframe.contentDocument.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
        iframe.contentWindow.print();
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 250);
    }, 250);
    
    showNotification('✓ Opening print dialog for PDF export', 'success');
}

function generatePDFHTML() {
    let cardsHTML = '';
    
    generatedCards.forEach(card => {
        const formattedVTU = formatVTUNumber(card.vtuNumber);
        const formattedAmount = formatAmount(card.amount);
        const maskedPIN = maskPIN(card.pin);
        const formattedDate = formatDate(card.purchaseDate);
        
        cardsHTML += `
            <div class="vtu-card">
                <div class="card-header">
                    <div class="card-logo">KZD</div>
                    <div class="card-provider">${card.provider}</div>
                </div>
                <div class="card-body">
                    <div class="card-field">
                        <span class="field-label">VTU Number</span>
                        <span class="field-value">${formattedVTU}</span>
                    </div>
                    <div class="card-field">
                        <span class="field-label">Data Bundle</span>
                        <span class="field-value amount">${formattedAmount}</span>
                    </div>
                    <div class="card-field">
                        <span class="field-label">PIN</span>
                        <span class="field-value pin">${maskedPIN}</span>
                    </div>
                    <div class="card-field">
                        <span class="field-label">Validity</span>
                        <span class="field-value">${card.validity}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="footer-item">
                        <span class="footer-label">Date</span>
                        <span class="footer-value">${formattedDate}</span>
                    </div>
                    <div class="footer-item">
                        <span class="footer-label">Serial</span>
                        <span class="footer-value">${card.serialNumber}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>VTU Cards - KofarArziki Data</title>
            <link rel="stylesheet" href="${window.location.origin}/style.css">
            <link rel="stylesheet" href="${window.location.origin}/print.css" media="print">
            <style>
                @media print {
                    body { background: white; margin: 0; padding: 0; }
                    .container { max-width: 100%; padding: 0; margin: 0; }
                    .card-preview-container { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5in; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card-preview-container">
                    ${cardsHTML}
                </div>
            </div>
        </body>
        </html>
    `;
}

// ============ ZIP DOWNLOAD ============
function downloadZIP() {
    if (generatedCards.length === 0) {
        showNotification('❌ No cards to export', 'error');
        return;
    }
    
    // Download JSON
    const jsonData = {
        exportedAt: new Date().toISOString(),
        totalCards: generatedCards.length,
        cards: generatedCards
    };
    downloadFile(
        JSON.stringify(jsonData, null, 2),
        `vtu-cards-${new Date().getTime()}.json`,
        'application/json'
    );
    
    // Download CSV
    let csv = 'VTU Number,Provider,Amount (MB),PIN,Validity,Purchase Date,Serial Number\n';
    generatedCards.forEach(card => {
        const row = [
            card.vtuNumber,
            card.provider,
            card.amount,
            card.pin,
            card.validity,
            card.purchaseDate,
            card.serialNumber
        ].map(field => `"${field}"`).join(',');
        csv += row + '\n';
    });
    downloadFile(csv, `vtu-cards-${new Date().getTime()}.csv`, 'text/csv');
    
    // Download HTML
    const htmlContent = generatePDFHTML();
    downloadFile(htmlContent, `vtu-cards-${new Date().getTime()}.html`, 'text/html');
    
    showNotification('✓ All files downloaded (JSON, CSV, HTML)', 'success');
}

// ============ PRINTING ============
function printCards() {
    if (generatedCards.length === 0) {
        showNotification('❌ No cards to print', 'error');
        return;
    }
    
    window.print();
}

// ============ PIN VISIBILITY ============
function togglePINVisibility() {
    pinVisible = !pinVisible;
    
    const pinElements = document.querySelectorAll('.field-value.pin');
    pinElements.forEach((element) => {
        const actualPin = element.getAttribute('data-pin');
        if (pinVisible) {
            element.textContent = actualPin;
        } else {
            element.textContent = maskPIN(actualPin);
        }
    });
    
    showNotification(pinVisible ? '👁 PIN visible' : '👁 PIN hidden', 'info');
}

// ============ LOCAL STORAGE ============
function saveData() {
    try {
        const data = {
            cards: generatedCards,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('kofararzikiData', JSON.stringify(data));
        updateStorageInfo();
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadData() {
    try {
        const stored = localStorage.getItem('kofararzikiData');
        if (stored) {
            const data = JSON.parse(stored);
            if (data.cards && Array.isArray(data.cards)) {
                generatedCards = data.cards;
                displayCards();
            }
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

function clearStorage() {
    const confirmed = confirm('Are you sure you want to clear all saved data? This action cannot be undone.');
    
    if (!confirmed) {
        return;
    }
    
    try {
        localStorage.removeItem('kofararzikiData');
        generatedCards = [];
        displayCards();
        updateStorageInfo();
        showNotification('✓ All saved data cleared', 'success');
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        showNotification('❌ Error clearing data', 'error');
    }
}

function updateStorageInfo() {
    const storageInfo = document.getElementById('storageInfo');
    
    try {
        const stored = localStorage.getItem('kofararzikiData');
        if (stored) {
            const data = JSON.parse(stored);
            const cardCount = data.cards ? data.cards.length : 0;
            const size = (stored.length / 1024).toFixed(2);
            storageInfo.innerHTML = `
                <strong>${cardCount} card(s) saved</strong><br>
                <small>Size: ${size} KB | Last updated: ${new Date(data.timestamp).toLocaleString()}</small>
            `;
        } else {
            storageInfo.textContent = 'No saved data';
        }
    } catch (error) {
        storageInfo.textContent = 'No saved data';
    }
}

// ============ UTILITY FUNCTIONS ============
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

function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    
    if (!container) {
        console.error('Notification container not found');
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', function(e) {
    // Ctrl+S or Cmd+S for saving
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveData();
        showNotification('✓ Data saved', 'success');
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'SELECT' && activeElement.tagName !== 'TEXTAREA') {
            resetForm();
        }
    }
});
