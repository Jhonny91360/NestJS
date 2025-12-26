<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Development enviroment

1. Clone project
2. Copy `.env.template` and rename to `.env`
3. Execute
   ```
   pnpm install
   ```
4. Start the image ( docker desktop)
   ```
   docker-compose up -d
   ```
5. Start backend with Nest
   ```
   npm start:dev
   ```
6. Go to
   ```
   localhost:3000/graphql
   ```
7. Execute **executeSeed** mutation to poblate database
