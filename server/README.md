# Bodhi Track - Learning Progress Tracker (Backend)

A robust Node.js/Express backend server that powers the Bodhi Track learning progress tracker application. This server provides RESTful APIs for managing DSA problems, system design topics, and DevOps tasks.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Secure password hashing
  - Token refresh mechanism

- **Data Management**
  - CRUD operations for learning resources
  - Progress tracking
  - Statistics generation
  - User preferences

- **API Endpoints**
  - User management
  - Learning resource management
  - Progress tracking
  - Statistics and analytics

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- cors for cross-origin resource sharing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bodhi-track.git
   cd bodhi-track/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bodhi-track
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=24h
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔧 API Documentation

### Authentication Endpoints

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
```

### DSA Endpoints

```
GET    /api/dsa
POST   /api/dsa
GET    /api/dsa/:id
PUT    /api/dsa/:id
DELETE /api/dsa/:id
GET    /api/dsa/stats
```

### System Design Endpoints

```
GET    /api/system-design
POST   /api/system-design
GET    /api/system-design/:id
PUT    /api/system-design/:id
DELETE /api/system-design/:id
GET    /api/system-design/stats
```

### DevOps Endpoints

```
GET    /api/devops
POST   /api/devops
GET    /api/devops/:id
PUT    /api/devops/:id
DELETE /api/devops/:id
GET    /api/devops/stats
```

### Dashboard Endpoints

```
GET    /api/dashboard/stats
GET    /api/dashboard/recent-activity
GET    /api/dashboard/achievements
```

## 📊 Database Schema

### User Schema
```javascript
{
  username: String,
  email: String,
  password: String,
  role: String,
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### DSA Problem Schema
```javascript
{
  title: String,
  difficulty: String,
  category: String,
  status: String,
  notes: String,
  userId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security

- Password hashing with bcrypt
- JWT token validation
- Rate limiting
- CORS configuration
- Input validation
- Error handling

## 📤 Deployment

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Configure vercel.json:
   ```json
   {
     "version": 2,
     "builds": [{"src": "server.js", "use": "@vercel/node"}],
     "routes": [{"src": "/(.*)", "dest": "server.js"}]
   }
   ```

3. Deploy:
   ```bash
   vercel
   ```

### Environment Variables (Production)

Required environment variables in production:
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV`
- `FRONTEND_URL`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📚 Error Handling

- Custom error handling middleware
- Structured error responses
- Validation error handling
- Async error handling

## 🔍 Logging

- Request logging
- Error logging
- Performance monitoring
- Activity tracking

## 📈 Performance

- Database indexing
- Query optimization
- Caching strategies
- Rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Node.js team
- MongoDB team
- Express.js contributors
- All contributors and supporters
