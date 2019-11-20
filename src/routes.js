import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';

import validateUserStore from './app/validators/User/UserStore';
import validateUpdateStore from './app/validators/User/UserUpdate';
import validateSessionStore from './app/validators/Session/SessionStore';
import validateMeetupStore from './app/validators/Meetup/MeetupStore';
import validateMeetupUpdate from './app/validators/Meetup/MeetupUpdate';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', validateUserStore, UserController.store);
routes.post('/sessions', validateSessionStore, SessionController.store);

routes.use(authMiddleware);

routes.put('/users', validateUpdateStore, UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', validateMeetupStore, MeetupController.store);
routes.put('/meetups/:id', validateMeetupUpdate, MeetupController.update);
routes.get('/meetups', MeetupController.index);
routes.delete('/meetups/:id', MeetupController.delete);

routes.get('/subscriptions', SubscriptionController.index);
routes.post('/meetups/:id/subscriptions', SubscriptionController.store);

export default routes;
