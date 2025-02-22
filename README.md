# 🚀 Bodhi Track - Learning Progress Tracker

![Bodhi Track Banner](./client/public/banner.png)

A comprehensive full-stack application for tracking your learning journey in DSA (Data Structures and Algorithms), System Design, and DevOps. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## ✨ Live Demo

- Frontend: [https://bodhi-track.vercel.app](https://bodhi-track.vercel.app)
- Backend API: [https://bodhi-track-api.vercel.app](https://bodhi-track-api.vercel.app)

## 🎯 Features

### 📊 Interactive Dashboard
- Real-time progress tracking across all learning paths
- Weekly targets and achievements visualization
- Recent activity feed
- Dark/Light mode support

### 💻 DSA Progress Tracking
- Track problems by difficulty (Easy, Medium, Hard)
- Categorize by data structures and algorithms
- Mark problems as Complete, In Progress, or Todo
- Add personal notes and solutions
- Track completion statistics

### 🏗️ System Design Learning
- Organize system design topics
- Track learning progress
- Store resources and notes
- Practice case studies

### 🛠️ DevOps Learning Path
- Structured learning modules
- Hands-on task tracking
- Resource management
- Progress monitoring

## 🛠️ Technology Stack

### Frontend
- React 18
- Tailwind CSS
- Chart.js
- Axios
- Context API
- JWT Authentication

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## 🏗️ Project Structure

```
bodhi-track/
├── client/                 # Frontend React application
│   ├── public/            # Public assets
│   ├── src/               # Source files
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Context providers
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # CSS styles
│   └── package.json      # Frontend dependencies
│
├── server/                # Backend Node.js/Express application
│   ├── controllers/      # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── package.json     # Backend dependencies
│
└── README.md            # Project documentation
```

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bodhi-track.git
   cd bodhi-track
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   Backend (.env in server folder):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bodhi-track
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=24h
   NODE_ENV=development
   ```

   Frontend (.env in client folder):
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start Development Servers**

   Backend:
   ```bash
   cd server
   npm run dev
   ```

   Frontend:
   ```bash
   cd client
   npm start
   ```

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add environment variables in Vercel dashboard

### Backend Deployment (Vercel)

1. Create vercel.json in server directory:
   ```json
   {
     "version": 2,
     "builds": [{"src": "server.js", "use": "@vercel/node"}],
     "routes": [{"src": "/(.*)", "dest": "server.js"}]
   }
   ```
2. Deploy using Vercel CLI:
   ```bash
   vercel
   ```

## 💡 Usage

1. **Register/Login**
   - Create an account or login
   - Set your learning preferences

2. **Dashboard**
   - View overall progress
   - Check weekly targets
   - See recent activities

3. **DSA Section**
   - Add problems
   - Track progress
   - Add notes and solutions

4. **System Design**
   - Organize topics
   - Track learning progress
   - Store resources

5. **DevOps**
   - Follow structured modules
   - Track task completion
   - Manage resources

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

## 📚 API Documentation

Detailed API documentation is available at:
- Development: http://localhost:5000/api-docs
- Production: https://bodhi-track-api.vercel.app/api-docs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Developer - [Your Name](https://github.com/yourusername)

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, email support@bodhitrack.com or join our Discord channel.
