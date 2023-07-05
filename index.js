import express from 'express';
import usersRouter from './routes/users.routes.js';
import databaseService from './services/database.services.js';

databaseService.connect();
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.post('/', (req, res) => {
    res.send('Hello World');
});
app.use('/users', usersRouter);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:3000`);
});
