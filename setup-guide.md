# file-uploader`

# instructions to setup project

npm init -y

# setup express and other dependencies

npm i express ejs passport passport-local express-validator express-session pg bcryptjs dotenv connect-flash connect-pg-simple

# setup prisma

npm i prisma

# prisma cli

npx prisma

# creates prisma & .env

npx prisma init
-- setup prisma schema in prisma.schema file
-set ENVIRONMENT VARIABLES in .env file

# migrate prisma schema to db schema

npx prisma migrate dev --name init \*\* use whenever prisma schema changes to keep db in sync

# install prisma client

npm i @prisma/client -- optional-auto installed while migrating

# install prisma-session-store for using session along with express-session

npm install @quixo3/prisma-session-store express-session --(install express-session if not already installed)

# add session model to prisma schema

model Session {
id String @id
sid String @unique
data String @db.VarChar(255)
expiresAt DateTime
}

# instal multer for file upload

npm i --save multer

# cloudinary for file upload

npm i cloudinary

# aiven ca.pem file should be base64 encoded(producino)

cat ./prisma/ca.pem | base64 -w 0

--paste the encoded text in database url in .env file(refer .env)

# install typescript

npm install --save-dev typescript @types/node @types/express @types/express-session @types/passport @types/passport-local @types/multer @types/cloudinary @types/bcryptjs @types/connect-flash @types/connect-pg-simple
npx tsc --init # If tsconfig.json is missing

# tsconfig.json configuration

--tsconfig bases
npm install --save-dev @tsconfig/node22
--Add to your tsconfig.json:
"extends": "@tsconfig/node22/tsconfig.json"

--tsconfig.json >
{
"extends": "@tsconfig/node22/tsconfig.json",
"compilerOptions": {
"module": "NodeNext",
"outDir": "./dist",
"sourceMap": true,
"rootDir": "./src"
},
"include": ["src/**/*"],
"exclude": ["node_modules", "dist"]
}

--change type to module in package.json
"type":"module"

# compiling and running ts files

npm i -D tsx

--compile ts file & run js file
npx tsx src/index.ts
--watch mode
npx tsx watch src/index.ts

--watch compile alone and not run js file(type checking ts file in cli - run in separate terminal)
npx tsc --watch --noEmit

# scripts in package.json

"scripts": {
"dev": "tsx watch src/index.ts",
"build": "tsc && node dist/index.js",
"typecheck": "tsc --watch --noEmit",
"prisma:generate": "prisma generate",
"prisma:migrate": "prisma migrate dev",
"prisma:deploy": "prisma migrate deploy"
},
