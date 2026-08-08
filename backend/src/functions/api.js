// ESM entry point for Azure Functions v4 programmatic model.
// The Azure Functions host uses import() to load this file when
// "type": "module" is set in package.json.
import { app as azureApp } from '@azure/functions';
import serverlessHttp from 'serverless-http';
import expressApp from '../../app.js';

const handler = serverlessHttp(expressApp);

azureApp.http('api', {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  authLevel: 'anonymous',
  route: '{*route}',
  handler: async (req, ctx) => {
    return handler(req, ctx);
  }
});
