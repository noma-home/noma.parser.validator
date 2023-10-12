<div style="margin-top: 24px; display: flex; flex-direction: row; align-items: center">
    <a href="https://noma.rent" target="blank"><img src="https://noma.rent/favicon.ico" width="48" alt="Nest Logo" style="margin-right: 6px" /></a>
    <p style="font-size: 24px; line-height: 24px; font-weight: bold;">NOMA</p>
</div>

---

# `noma.parser.validator`

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/Rabbitmq-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

## Description

`nona.parser.validator` - it is a heading microservice in `noma.parser.cluster`. It's send parser requests and validates responses. Finds original adverts, filter realtors, creates valid adverts in `noma.advert.cluster`. 

### Communication BUS (RabbitMQ)

To communicate it use **RabbitMQ** queue. Supports this patterns:

-   `advert:latest` - filters array of adverts URLs depends on its existing.
-   `advert:new` - validates a new advert, find duplicates, originals, detect is seller realtor. 
-   `advert:update` - validates advert update.
-   `parse:latest` - for a giving data sends request to parse the latest adverts to specific parser. 

After each procedure, parser sends data to a giving queue(Set it in .env).

## Setup parser

Before start, you need to set up some settings.

### Step 1. Create `.env` file.

Copy `.env.template` as `.env` and fill each field.

### Step 2. Install dependencies.

Run `npm i` to install all dependencies.

### Step 3. Build.

Run `npm run build` to build project.

## Run parser

### Run parser in DEV mode

```shell
npm run start:dev
```

### Run parser in PRODUCTION mode

```shell
npm run start:prod
```
