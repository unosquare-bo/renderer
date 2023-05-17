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

| Query param | Type   | Required | Allowed values                                      | Default value (if not provided)                                 | Constraints                               |
|-------------|--------|----------|-----------------------------------------------------|-----------------------------------------------------------------|-------------------------------------------|
| title       | string | false    |                                                     | Congratulations!                                                |                                           |
| subtitle    | string | false    |                                                     |                                                                 | Max length: 200 characters                |
| uid         | enum   | false    | ['gunther.revollo', 'diego.landa', 'arleth.vargas'] | [(Generic photo)](https://grandint.sirv.com/Images/default.jpg) |                                           |
| topic       | enum   | true     | ['birthday', 'promotion']                           |                                                                 |                                           |
| name        | string | true     |                                                     |                                                                 |                                           |
| date        | string | false    |                                                     |                                                                 | Should be in ISO-8601 format (YYYY-MM-DD) |