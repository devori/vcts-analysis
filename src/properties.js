import path from 'path'

let logDirectory = process.env.LOG_DIR;
if (!logDirectory) {
    logDirectory = path.resolve(__dirname, '../logs');
}
export default {
    LOG_DIR: path.resolve(logDirectory),
    VCTS_PRIVATE_API_URL: "http://localhost:8000/api/v1/private",
    VCTS_PUBLIC_API_URL: "http://localhost:8000/api/v1/public"
}