# VitaRise - Male Sexual Health Tracking Platform

A comprehensive health tracking application designed specifically for male sexual wellness and treatment monitoring.

## Features

- **Daily Tracking**: Monitor medication intake, symptoms, and performance
- **Progress Visualization**: Charts and graphs showing your improvement over time
- **Achievement System**: Gamified milestones for your 180-day transformation journey
- **Educational Content**: Access to specialized e-books and daily health tips
- **Calendar View**: Visual representation of your treatment consistency
- **Support System**: Direct contact with health specialists

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GuilhermeCaett/vitariseAPP.git
cd vitariseAPP
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This project is configured for deployment on Netlify with automatic builds from the main branch.

### Build Settings for Netlify:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard-related components
│   ├── Layout/         # Layout components (Header, Navigation)
│   ├── Progress/       # Progress tracking components
│   └── Achievements/   # Achievement system components
├── types/              # TypeScript type definitions
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Features Overview

### 🏠 Dashboard
- Today's entry form for medication and symptoms
- Quick stats overview
- Current streak tracking

### 📅 Calendar
- Monthly view of treatment history
- Visual indicators for completed days
- Progress tracking

### 📊 Progress
- Interactive charts showing improvement over time
- Medication adherence tracking
- Performance metrics visualization

### 📚 Educational Content
- Downloadable e-books on sexual health topics
- Daily rotating health tips
- Specialized content for treatment optimization

### 🏆 Achievements
- 180-day transformation journey milestones
- Streak-based achievements
- Progress tracking with visual indicators

### 💬 Support
- Direct contact with health specialists
- FAQ section
- Professional guidance and treatment support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Contact

For support or questions, contact: contact@vitariseboost.com

---

**VitaRise** - Your journey to enhanced sexual wellness starts here. 🚀