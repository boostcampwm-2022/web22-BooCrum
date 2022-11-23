## .env 양식

```
MYSQL_HOST=
MYSQL_PORT=
MYSQL_USERNAME=
MYSQL_PASSWORD=
MYSQL_DATABASE=
SESSION_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

NODE_ENV=develop|production

REDIRECT_AFTER_LOGIN=
REDIRECT_FAIL_LOGIN=
```

## migration 실행 시

```
// 마이그레이션 반영 목록 확인
npm run typeorm -- migration:show -d src/ormconfig.ts
// 마이그레이션 전체 적용
npm run typeorm -- migration:run -d src/ormconfig.ts
// 가장 최근에 적용된 마이그레이션 1개 파일 되돌리기
npm run typeorm -- migration:revert -d src/ormconfig.ts
```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
