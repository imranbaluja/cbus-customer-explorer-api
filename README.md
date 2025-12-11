# Cbus Customer Explorer Api

A serverless-ready NestJS backend for customer data exploration, built for AWS Lambda using a JSON file as the datasource. Features robust filtering, pagination, and sorting, with OpenAPI (Swagger) documentation and production-grade logging.

## Features

- **REST API** for customer data with advanced filtering, pagination, and sorting
- **Serverless deployment** via AWS Lambda and Serverless Framework
- **Swagger/OpenAPI** documentation at `/docs`
- **Winston logging** with CloudWatch integration
- **Validation and error handling** using NestJS pipes and filters
- **Unit and integration tests** with Jest and Supertest
- **CI/CD** via GitHub Actions

## Project Structure

```
src/
  app.controller.ts
  app.module.ts
  bootstrap-common.ts
  lambda.ts
  main.ts
  common/
    filters/
    interceptors/
    logger/
  customer/
    customer.controller.ts
    customer.module.ts
    customer.service.ts
    dto/
    interfaces/
    __tests__/
  data/
    customers.json
```

## Getting Started

### Prerequisites

- Node.js 20+ (Node.js 24.x for AWS Lambda)
- npm
- AWS credentials (for deployment)
- Serverless Framework (`npm install -g serverless@4`)

### Installation

```bash
npm install
```

### Running Locally

```bash
# Build the project
npm run build

# Start the server (default port 3001)
npm start

# Or run in development mode (with hot reload)
npm run start:dev
```

### API Documentation

After starting the server, visit [http://localhost:3001/docs](http://localhost:3001/docs) for Swagger UI.

### Testing

```bash
# Run all tests with coverage
npm test

# Watch mode
npm run test:watch

# Lint the code
npm run lint
```

### Deployment

Deploy to AWS Lambda using Serverless Framework:

```bash
npm run deploy
```

Remove deployment:

```bash
npm run deploy:remove
```

## API Endpoints

- `GET /customers` — List customers with support for:
  - Pagination: `page`, `limit`
  - Search: `search`
  - Sorting: `sort` (`fullName`, `registrationDate`), `order` (`asc`, `desc`)
  - Date filtering: `dateFrom`, `dateTo`
  - Email domain filter: `emailDomain`
- `GET /` — Health check

See `/docs` for full OpenAPI details.

## Environment Variables

- `NODE_ENV` — Node environment (`development`, `production`)
- `ENV_SHORT` — Short environment name (e.g., `dev`, `tst`, `prd`)
- `SERVICE_NAME` — Service name
- `AWS_ACCOUNT_ID`, `AWSREGION` — AWS deployment details

## Serverless Deployment

See `serverless.yml` for configuration. The main Lambda handler is `dist/lambda.handler`.

## Logging

- Uses Winston for logging.
- In production, logs are sent to AWS CloudWatch.
- In development, logs are output to the console.

## CI/CD

- GitHub Actions workflow: `.github/workflows/ci-cd.yml`
- Steps: install, test, build, deploy

## License

MIT
