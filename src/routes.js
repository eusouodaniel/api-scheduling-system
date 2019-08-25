import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import AvailabilityController from './app/controllers/AvailabilityController';
import DiaryController from './app/controllers/DiaryController';
import FileController from './app/controllers/FileController';
import NotificationController from './app/controllers/NotificationController';
import ProviderController from './app/controllers/ProviderController';
import SessionController from './app/controllers/SessionController';
import ScheduleController from './app/controllers/ScheduleController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);
routes.get('/diaries', DiaryController.index);
routes.post('/files', upload.single('avatar'), FileController.store);
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);
routes.get('/providers', ProviderController.index);
routes.get('/providers/:id/availabilities', AvailabilityController.index);
routes.get('/schedules', ScheduleController.index);
routes.post('/schedules', ScheduleController.store);
routes.delete('/schedules/:id', ScheduleController.delete);
routes.put('/users', UserController.update);

export default routes;
