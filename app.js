import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security and middleware setup
app.use(helmet());  // Security headers
app.use(cors());    // Cross-origin resource sharing
app.use(express.json());  // Parse JSON request bodies
app.use(morgan('dev'));   // Request logging

// Health check endpoint
app.get('/health', (_, res) => res.json({ success: true, data: { status: 'ok' }, message: 'Healthy' }));

// Mount API routes
app.use('/', routes);

// Debug: Log all registered routes for development
console.log('📌 Registered Express Routes:');
app._router.stack.forEach((layer) => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
    console.log(`${methods} ${layer.route.path}`);
  } else if (layer.name === 'router') {
    layer.handle.stack.forEach((handler) => {
      if (handler.route) {
        const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
        console.log(`${methods} ${handler.route.path}`);
      }
    });
  }
});
console.log('===================================');

// Handle 404 - route not found
app.use((_, res,) => {
  res.status(404).json({ success: false, error: 'Not Found', message: 'Route not found' });
});

// Central error handling middleware
app.use(errorHandler);

export default app;
