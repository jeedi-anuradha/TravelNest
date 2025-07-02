require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

// Route imports
const userRoutes = require('./Routes/AuthRoute');
const HotelRoutes = require('./Routes/HotelRoutes');
const PopularRoutes = require('./Routes/Popular');
const wishlistRoutes = require('./Routes/wishlist');
const bookingRoutes = require('./Routes/booking');

const app = express();
const port = process.env.PORT || 5000;

// Enhanced MongoDB connection configuration
const Mongo_url = process.env.MONGO_URL;

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,  // Increased from 10s to 30s
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  maxPoolSize: 50,  // Increased connection pool size
  retryWrites: true,
  w: 'majority',
  ssl: true,
  tls: true,
  // For MongoDB Atlas:
  // tlsCAFile: require('fs').readFileSync(`${__dirname}/rds-combined-ca-bundle.pem`)
};

// Database connection with enhanced error handling
const connectWithRetry = async () => {
  try {
    await mongoose.connect(Mongo_url, mongooseOptions);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB - retrying in 5 seconds', err);
    setTimeout(connectWithRetry, 5000);
  }
};

// Initialize database connection
connectWithRetry();

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected from DB');
});

// Middlewares
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(cookieParser());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/hotels', HotelRoutes);
app.use('/api/popular', PopularRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/booking', bookingRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'UP',
    database: dbStatus,
    timestamp: new Date()
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  server.close(() => {
    process.exit(0);
  });
});