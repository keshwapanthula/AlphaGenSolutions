// OpenAPI 3.0 spec for the AlphaGen Solutions API — served at /api-docs
const errorResponse = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string' }
  }
};

const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['employee', 'supervisor', 'admin'] },
    employeeId: { type: 'string' },
    department: { type: 'string' }
  }
};

const timesheetEntry = {
  type: 'object',
  required: ['date', 'taskDescription', 'hoursWorked'],
  properties: {
    date: { type: 'string', format: 'date' },
    taskDescription: { type: 'string' },
    hoursWorked: { type: 'number', minimum: 0.25, maximum: 24 }
  }
};

const timesheetSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    employeeId: { type: 'string' },
    supervisorId: { type: 'string' },
    weekStartDate: { type: 'string', format: 'date-time' },
    weekEndDate: { type: 'string', format: 'date-time' },
    status: { type: 'string', enum: ['draft', 'submitted', 'approved', 'rejected'] },
    entries: { type: 'array', items: timesheetEntry },
    employeeNotes: { type: 'string' },
    supervisorNotes: { type: 'string' }
  }
};

const security = [{ bearerAuth: [] }, { cookieAuth: [] }];

const standardErrors = {
  401: { description: 'Not authenticated', content: { 'application/json': { schema: errorResponse } } },
  403: { description: 'Access denied', content: { 'application/json': { schema: errorResponse } } }
};

export default {
  openapi: '3.0.3',
  info: {
    title: 'AlphaGen Solutions API',
    version: '1.0.0',
    description:
      'REST API for the AlphaGen Solutions website, employee portal, and supervisor portal. ' +
      'Authentication uses short-lived JWT access tokens with rotating refresh tokens (httpOnly cookies). ' +
      'Cookie-authenticated state-changing requests must include the `X-Requested-With: XMLHttpRequest` header (CSRF defense).'
  },
  servers: [{ url: 'http://localhost:5000', description: 'Local development' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'token' }
    }
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Ops'],
        summary: 'Health check',
        responses: { 200: { description: 'API is running' } }
      }
    },
    '/api/readiness': {
      get: {
        tags: ['Ops'],
        summary: 'Readiness probe',
        responses: { 200: { description: 'Ready' }, 503: { description: 'Not ready' } }
      }
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Create an account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'password'],
                properties: {
                  firstName: { type: 'string', maxLength: 50 },
                  lastName: { type: 'string', maxLength: 50 },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8, description: 'Must contain uppercase, lowercase, and a number' },
                  role: { type: 'string', enum: ['employee', 'supervisor'], description: 'admin cannot be self-assigned' },
                  employeeId: { type: 'string' },
                  department: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Account created; sets token + refreshToken cookies',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' }, token: { type: 'string' }, user: userSchema }
                }
              }
            }
          },
          400: { description: 'Validation failed', content: { 'application/json': { schema: errorResponse } } },
          409: { description: 'Email already registered', content: { 'application/json': { schema: errorResponse } } }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Log in',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Logged in; sets token + refreshToken cookies' },
          401: { description: 'Invalid credentials', content: { 'application/json': { schema: errorResponse } } }
        }
      }
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Rotate refresh token and get a new access token',
        description: 'Requires the httpOnly refreshToken cookie set by login/register.',
        responses: {
          200: { description: 'New access + refresh tokens issued' },
          401: { description: 'Missing, invalid, or revoked refresh token', content: { 'application/json': { schema: errorResponse } } }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Log out (clears auth cookies)',
        responses: { 200: { description: 'Logged out' } }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user',
        security,
        responses: {
          200: { description: 'Current user', content: { 'application/json': { schema: { type: 'object', properties: { user: userSchema } } } } },
          ...standardErrors
        }
      }
    },
    '/api/timesheets': {
      get: {
        tags: ['Timesheets'],
        summary: 'List timesheets (own for employees, team for supervisors)',
        security,
        responses: {
          200: {
            description: 'Timesheets',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    count: { type: 'integer' },
                    timesheets: { type: 'array', items: timesheetSchema }
                  }
                }
              }
            }
          },
          ...standardErrors
        }
      },
      post: {
        tags: ['Timesheets'],
        summary: 'Create a draft timesheet (employee only)',
        security,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['weekOf', 'entries'],
                properties: {
                  weekOf: { type: 'string', format: 'date' },
                  entries: { type: 'array', minItems: 1, items: timesheetEntry },
                  employeeNotes: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Draft created', content: { 'application/json': { schema: timesheetSchema } } },
          400: { description: 'Validation failed / no supervisor assigned', content: { 'application/json': { schema: errorResponse } } },
          409: { description: 'Timesheet already exists for this week', content: { 'application/json': { schema: errorResponse } } },
          ...standardErrors
        }
      }
    },
    '/api/timesheets/{id}': {
      get: {
        tags: ['Timesheets'],
        summary: 'Get a timesheet by id (owner, assigned supervisor, or admin)',
        security,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Timesheet', content: { 'application/json': { schema: timesheetSchema } } },
          404: { description: 'Not found', content: { 'application/json': { schema: errorResponse } } },
          ...standardErrors
        }
      },
      put: {
        tags: ['Timesheets'],
        summary: 'Update a draft timesheet (employee only, drafts only)',
        security,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Updated' },
          400: { description: 'Only drafts can be edited', content: { 'application/json': { schema: errorResponse } } },
          ...standardErrors
        }
      }
    },
    '/api/timesheets/{id}/submit': {
      post: {
        tags: ['Timesheets'],
        summary: 'Submit a draft for approval (employee only)',
        security,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Submitted' },
          400: { description: 'Only drafts can be submitted', content: { 'application/json': { schema: errorResponse } } },
          ...standardErrors
        }
      }
    },
    '/api/timesheets/{id}/approve': {
      post: {
        tags: ['Timesheets'],
        summary: 'Approve a submitted timesheet (supervisor/admin)',
        security,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Approved' },
          400: { description: 'Only submitted timesheets can be approved', content: { 'application/json': { schema: errorResponse } } },
          ...standardErrors
        }
      }
    },
    '/api/timesheets/{id}/reject': {
      post: {
        tags: ['Timesheets'],
        summary: 'Reject a submitted timesheet with a reason (supervisor/admin)',
        security,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['supervisorNotes'],
                properties: { supervisorNotes: { type: 'string' } }
              }
            }
          }
        },
        responses: {
          200: { description: 'Rejected' },
          400: { description: 'Reason required / not in submitted state', content: { 'application/json': { schema: errorResponse } } },
          ...standardErrors
        }
      }
    },
    '/api/contact': {
      post: {
        tags: ['Contact'],
        summary: 'Submit a contact form (rate limited)',
        responses: {
          200: { description: 'Message received' },
          429: { description: 'Rate limit exceeded' }
        }
      }
    }
  }
};
