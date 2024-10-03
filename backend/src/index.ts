import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import csurf from 'csurf';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { currencyRoutes } from './routes/currencyRoutes';
import { csrfRoutes } from './routes/csrfRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Add helmet middleware to enhance security, including CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Only allow resources from the same origin
      scriptSrc: ["'self'", "http://localhost:4000"], // Allow scripts from your frontend and self
      objectSrc: ["'none'"], // Disallow object sources
      imgSrc: ["'self'", "data:"], // Allow images from self and data URIs
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles (use cautiously)
      frameSrc: ["'none'"], // Disallow framing
      // Add other directives as needed
    },
  },
}));

app.use(cors({
  origin: process.env.FRONT_URL, // Change this to your Vue.js app's URL
  credentials: true, // Allow credentials (cookies) to be included
}));
app.use(cookieParser()); // Use cookie-parser middleware
app.use(express.json());

// CSRF protection middleware
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// Middleware to set CSRF token cookie
app.use((req: Request, res: Response, next: NextFunction) => {
  res.cookie('XSRF-TOKEN', req.csrfToken()); // Set the CSRF token
  next();
});

// Use the CSRF routes
app.use('/api', csrfRoutes);

// Use the currency routes
app.use('/api', currencyRoutes);


// Error handler for CSRF token errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('CSRF Token Error:', err); // Log for debugging
    res.status(403).json({ error: 'Invalid CSRF token' });
  } else {
    next(err);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
