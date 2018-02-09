import * as db from './database';
import * as collector from './collector';

let user, market, firebaseAuthFilePath, interval;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 2) {
    switch(args[i]) {
        case '--firebase-auth-file-path':
            firebaseAuthFilePath = args[i+1];
            break;
        case '--user':
            user = args[i+1];
            break;
        case '--market':
            market = args[i+1];
            break;
        case '--interval':
            interval = args[i+1];
    }
}

if (!user || !market || !firebaseAuthFilePath) {
    throw `Arguments error: ${firebaseAuthFilePath} ${user} ${market}`;
}

db.initialize(require(firebaseAuthFilePath));

setInterval(() => {
    collector.collect(user, market);
}, interval);