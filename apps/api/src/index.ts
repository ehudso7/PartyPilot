import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic API routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'PartyPilot API',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/trips/plan',
      '/api/trips/:tripId'
    ]
  });
});

// Placeholder trip planning endpoint
app.post('/api/trips/plan', (req, res) => {
  res.status(201).json({
    message: 'Trip planning endpoint - coming soon',
    trip: null,
    events: [],
    venues: []
  });
});

// Placeholder trip get endpoint
app.get('/api/trips/:tripId', (req, res) => {
  res.json({
    message: 'Trip retrieval endpoint - coming soon',
    trip: null
  });
});

// 404 handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'API endpoint not found',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
