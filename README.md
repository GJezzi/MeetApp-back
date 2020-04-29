# MEETAPP Challenge
## Initial challenge for RocketSeat GoStack Bootcamp
### NODEJS Backend API
#### Technologies implemented in the project
----
:white_check_mark: [NODEJS](https://nodejs.org/en/)

:white_check_mark: [express](https://expressjs.com/)

:white_check_mark: [nodemon](https://nodemon.io/)

:white_check_mark: [Sucrase](https://sucrase.io/)

:white_check_mark: [Docker](https://www.docker.com/)

:white_check_mark: [Sequelize](https://sequelize.org/)

:white_check_mark: [PostgreSQL](https://www.postgresql.org/)

:white_check_mark: [node-postgres](https://node-postgres.com/)

:white_check_mark: [Redis](https://redis.io/)

:white_check_mark: [MongoDB](https://www.mongodb.com/)

:white_check_mark: [Mongoose](https://mongoosejs.com/)

:white_check_mark: [JWT](https://jwt.io/)

:white_check_mark: [Multer](https://github.com/expressjs/multer)

:white_check_mark: [Bcrypt](https://www.npmjs.com/package/bcrypt)

:white_check_mark: [Youch](https://www.npmjs.com/package/youch)

:white_check_mark: [Yup](https://www.npmjs.com/package/yup)

:white_check_mark: [Bee Queue](https://github.com/bee-queue/bee-queue)

:white_check_mark: [Nodemailer](https://nodemailer.com/about/)

:white_check_mark: [date-fns](https://date-fns.org/)

:white_check_mark: [Sentry](https://sentry.io/welcome/)

:white_check_mark: [DotEnv](https://www.npmjs.com/package/dotenv)

:white_check_mark: [VS Code](https://code.visualstudio.com/) with [ESLint](https://eslint.org/)

----
:arrow_right: How to use

#### To clone and run this application, you'll need [Git](https://git-scm.com/), [Node.js v10.15](https://nodejs.org/en/) or higher + [Yarn v1.5](https://yarnpkg.com/) or higher installed on your computer. From your command line:
## Install API

```
# Clone this repository
$ git clone https://github.com/gjezzi/meetapp-back

# Go into the repository
$ cd meetapp-back

# Install dependencies
$ yarn install

# Created Postgree Docker container
$ docker run --name meetappdb -e POSTGRES_PASSWORD=docker -e POSTGRES_DB=meetappdb -p 5432:5432 -d postgres

# Created Mongo Docker container
$ docker run --name mongo -p 27017:27017 -d -t mongo

# Created Redis Docker container
$ docker run --name redismeetapp -p 6379:6379 -d -t redis:alpine

# Run Migrates
$ yarn migrate

# Run Seeds
$ yarn seed

# Run the API
$ yarn dev
```
----




