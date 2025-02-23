const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Default credentials
const DEFAULT_USERNAME = 'bodhi';
const DEFAULT_PASSWORD = 'qwerty';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Login user
exports.login = async (req, res) => {
  try {
    console.log('Login attempt with body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');
    console.log('User found in database:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    console.log('Comparing passwords...');
    const isPasswordValid = await user.matchPassword(password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);
    console.log('Login successful for user:', email);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
};

// Register user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Registration attempt with:", { username, email });

    // Input validation
    if (!username || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    // Validate username
    if (username.length < 3) {
      console.log("Username too short:", username.length);
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Validate password
    if (password.length < 6) {
      console.log("Password too short:", password.length);
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check for existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log("Username already exists:", username);
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("Email already exists:", email);
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user - password will be hashed by the User model middleware
    console.log("Creating new user...");
    const user = await User.create({
      username,
      email,
      password, // plain password - will be hashed by middleware
      isFirstLogin: true
    });

    console.log("User created successfully:", user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration'
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    // Since we're using JWT, we just need to tell the client to remove the token
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging out'
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user profile'
    });
  }
};

// Verify token middleware
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
