# Create a Postgres image using docker:
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5433:5432 -d postgres

# Create migration  
npm run migrate:create migrationName

# Jest
 npm run test 
 npm run test:verbose
 npm run test:clearCache
 npm run test:watch
 npm run test:staged
 npm run test:coverage