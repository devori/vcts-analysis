import express from 'express';
import bodyParser from 'body-parser';
import * as argumentParser from './util/argument-parser';
import * as db from './database/firestore';
import * as collector from './schedule/collector';
import privateRouter from './router/private';

const args = argumentParser.parse(process.argv.slice(2));
const {user, market, interval} = args;
const firebaseAuthFilePath = args['firebase-auth-file-path'];

if (!user || !market || !firebaseAuthFilePath) {
    throw `Arguments error: ${firebaseAuthFilePath} ${user} ${market}`;
}

db.initialize(require(firebaseAuthFilePath));

collector.start(interval, user, market);

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.info(`${req.method} ${req.url}`);
    next();
});
app.use('/api/v1/private', privateRouter);
app.use((err, req, res) => {
    console.error(err);
    res.status(500).json({
        error: err
    });
});

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.info(`Analysis app listening on port ${PORT}!`);
});
