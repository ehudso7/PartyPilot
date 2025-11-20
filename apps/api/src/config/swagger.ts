import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PartyPilot API',
      version: '1.0.0',
      description: 'AI-powered event planning and booking system',
      contact: {
        name: 'PartyPilot Support',
        email: 'support@partypilot.app',
        url: config.appUrl,
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: config.appUrl,
        description: 'Production server',
      },
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            phone: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
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
            budgetLevel: { type: 'string' },
            status: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
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
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Trips',
        description: 'Trip planning and management',
      },
      {
        name: 'Users',
        description: 'User management and GDPR',
      },
      {
        name: 'Share',
        description: 'Public sharing endpoints',
      },
      {
        name: 'Health',
        description: 'System health checks',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/modules/**/controller.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
