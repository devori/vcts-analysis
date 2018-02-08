import * as db from './database';
import * as collector from './collector';

let user, market, firebaseAuthDir;
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 2) {
    switch(args[i]) {
        case '--firebase-auth-dir':
            firebaseAuthDir = args[i+1];
            break;
        case '--user':
            user = args[i+1];
            break;
        case '--market':
            market = args[i+1];
            break;
    }
}

if (!user || !market || !firebaseAuthDir) {
    throw `Arguments error: ${firebaseAuthDir} ${user} ${market}`;
}

db.initialize(firebaseAuthDir);

setInterval(() => {
    collector.collect(user, market);
}, 1000 * 60 * 60);