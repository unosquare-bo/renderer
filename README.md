# Renderer
## Description

App to generate a congratulations image based on query inputs built with [NestJS](https://github.com/nestjs/nest) framework.
## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Usage

After running the app with one of the commands above, you should be able to access it at http://localhost:3001.

In order to generate the image, the renderer expects the following query parameters:

| Field    | Type   | Required | Constraints                                          |
|----------|--------|----------|------------------------------------------------------|
| title    | string | true     |                                                      |
| subtitle | string | false    | 200 characters max                                   |
| uid      | enum   | true     | Must be one of the following values: gunther.revollo |
| topic    | enum   | true     | Must be one of the following values: birthday        |
| name     | string | true     |                                                      |
| date     | string | false    |                                                      |
