export function parse(args) {
    const result = {};
    for (let i = 0; i < args.length; i += 2) {
        if (args[i].startsWith('--')) {
            result[args[i].slice(2)] = args[i+1];
        } else {
            throw 'argument key error';
        }
    }
    return result;
}

