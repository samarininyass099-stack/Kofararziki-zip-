# VTU Data Card - Print Ready System

A professional VTU (Verifying Telephone Unit) data card generator with high-quality print-ready output in blue and white design.

## Features

- 🎨 Professional blue and white card design
- 🖨️ Print-ready PDF generation
- 📊 VTU data management
- 💾 ZIP data compression support
- 🎯 High-quality output (300 DPI ready)
- 📱 Responsive design

## Project Structure

```
.
├── index.html          # Main web interface
├── style.css           # Blue & white design stylesheet
├── script.js           # Card generation logic
├── vtu-data.json       # Sample VTU data
├── print.css           # Print-specific styling
└── README.md
```

## Quick Start

1. Open `index.html` in your browser
2. Enter VTU data or upload from JSON
3. Preview the card design
4. Click "Print" or "Download as PDF"

## Data Format

```json
{
  "vtuNumber": "234812345678",
  "provider": "Provider Name",
  "amount": "1000",
  "validity": "30 Days",
  "pin": "****-****-****",
  "purchaseDate": "2026-09-08"
}
```

## Printing

- Set printer to landscape mode for optimal card size
- Use 4x6 inch card stock for professional results
- Print quality: High (minimum 300 DPI)

## License

MIT
