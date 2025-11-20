import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PartyPilot API',
      version: '1.0.0',
      description: 'AI-powered event planning and booking system API',
      contact: {
        name: 'PartyPilot Support',
        email: 'support@partypilot.app',
      },
    },
    servers: [
      {
        url: config.appUrl || 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            phone: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Trip: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            title: { type: 'string' },
            city: { type: 'string' },
            dateStart: { type: 'string', format: 'date-time' },
            dateEnd: { type: 'string', format: 'date-time' },
            groupSizeMin: { type: 'integer' },
            groupSizeMax: { type: 'integer' },
            occasion: { type: 'string' },
            budgetLevel: { type: 'string', enum: ['low', 'medium', 'high'] },
            status: { type: 'string', enum: ['draft', 'planned', 'confirmed', 'completed', 'cancelled'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            tripId: { type: 'string' },
            venueId: { type: 'string', nullable: true },
            orderIndex: { type: 'integer' },
            type: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            isPrimary: { type: 'boolean' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            details: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Trips', description: 'Trip planning and management' },
      { name: 'Reservations', description: 'Venue reservation management' },
      { name: 'Users', description: 'User data and GDPR compliance' },
      { name: 'Share', description: 'Public itinerary sharing' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/modules/*/controller.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
