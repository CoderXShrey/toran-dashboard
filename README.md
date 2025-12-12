# toran-dashboard

React + Vite admin dashboard for Toran Electronics inventory management system with AI chatbot integration, theme toggle, and CSV export functionality.

## Features

- 📦 **Inventory Management**: Add, edit, delete items with SKU tracking
- 🔍 **Search & Filter**: Search by SKU or item name, filter by category
- 📊 **Analytics Dashboard**: View KPIs (total items, stock levels, low stock alerts)
- 💬 **AI Chatbot**: Simulated AI assistant for inventory queries
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📥 **CSV Export**: Export inventory data for analysis
- 💾 **Local Storage**: Persistent inventory data across sessions
- 📱 **Responsive**: Works on desktop and tablets

## Tech Stack

- **React 18**: UI library
- **Vite**: Fast build tool and dev server
- **CSS3**: Styling with CSS variables for theming
- **localStorage**: Data persistence

## Project Structure

```
toran-dashboard/
├── index.html          # Main HTML file
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── .gitignore          # Git ignore rules
└── src/
    ├── main.jsx        # React app entry point
    ├── App.jsx         # Main App component
    └── App.css         # Styling with CSS variables
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CoderXShrey/toran-dashboard.git
   cd toran-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Inventory View
- Add new items with SKU, name, category, quantity, price, and location
- Edit items by clicking the "Edit" button
- Delete items by clicking the "Delete" button
- Search items by SKU or name
- Filter items by category (Fans, Lights, Bells, Accessories)
- Export all inventory data to CSV

### Analytics View
- See total number of item types
- View total units in stock
- Monitor items with low stock (<5 units)

### AI Chatbot
- Ask questions about inventory (e.g., "Show me fans")
- Demo uses simulated AI responses
- Replace `sendToAI()` function with real API call for production

### Theme Toggle
- Click the "Dark" switch in sidebar to toggle theme
- Theme preference is saved in localStorage

## Data Persistence

All inventory data is stored in the browser's localStorage under the key `toran_inventory_v1`. This means:
- Data persists across browser sessions
- Data is local to your device (not synced to cloud)
- Clearing browser storage will delete all data

## Sample Data

The app comes with 3 sample items:
- FAN-001: Ceiling Fan A (Fans) - 12 units
- LGT-101: LED Bulb 9W (Lights) - 48 units
- BEL-55: Door Bell Model X (Bells) - 8 units

## Customization

### Theme Colors
Edit CSS variables in `src/App.css` (`:root` section):

```css
:root {
  --bg: #ffffff;        /* Background color */
  --panel: #f7f7f7;     /* Panel background */
  --text: #111111;      /* Text color */
  --muted: #6b6b6b;     /* Muted text */
  --accent: #111111;    /* Accent color */
}
```

### AI Chatbot Integration
To connect a real AI API, modify the `handleSendChat` function in `src/App.jsx` to call your API endpoint instead of the demo response.

## Future Enhancements

- [ ] Backend API integration
- [ ] Database synchronization
- [ ] User authentication
- [ ] Order management system
- [ ] Real-time notifications
- [ ] Export to PDF
- [ ] Advanced analytics charts
- [ ] Mobile app version

## License

MIT

## Author

CoderXShrey

## Support

For issues or questions, open an issue on GitHub.
