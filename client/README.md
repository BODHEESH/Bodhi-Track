# Bodhi Track - Learning Progress Tracker (Frontend)

A modern, responsive web application built with React to track your progress in DSA (Data Structures and Algorithms), System Design, and DevOps learning journey.

## 🚀 Features

- **Interactive Dashboard**
  - Real-time progress tracking
  - Weekly targets and achievements
  - Visual progress indicators
  - Dark/Light mode support

- **DSA Tracker**
  - Problem categorization
  - Difficulty-based filtering
  - Status tracking (Completed, In Progress, Todo)
  - Progress statistics

- **System Design Section**
  - Topic-wise organization
  - Resource management
  - Progress tracking

- **DevOps Learning Path**
  - Structured learning modules
  - Hands-on task tracking
  - Resource integration

## 🛠️ Tech Stack

- React 18
- Tailwind CSS for styling
- Axios for API requests
- Chart.js for visualizations
- Context API for state management
- JWT for authentication

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bodhi-track.git
   cd bodhi-track/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENV`: Environment (development/production)

### Available Scripts

- `npm start`: Run development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## 📱 Components

### Core Components

1. **Dashboard**
   - Overview of all learning tracks
   - Progress statistics
   - Recent activities

2. **DSA Tracker**
   - Problem list
   - Status management
   - Difficulty filtering

3. **System Design**
   - Topic organization
   - Progress tracking
   - Resource management

4. **DevOps Tasks**
   - Task management
   - Progress tracking
   - Resource integration

## 🔐 Authentication

- JWT-based authentication
- Secure token storage
- Protected routes
- Automatic token refresh

## 🎨 Styling

- Tailwind CSS for responsive design
- Dark/Light theme support
- Custom component styling
- Responsive layouts

## 📤 Deployment

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Configure environment variables in Vercel dashboard

### Manual Build

```bash
npm run build
```

## 🧪 Testing

- Unit tests with Jest
- Component testing with React Testing Library
- Integration tests
- Run tests: `npm test`

## 📚 Best Practices

- Component organization
- State management patterns
- Performance optimization
- Code splitting
- Error handling
- Loading states

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and supporters
