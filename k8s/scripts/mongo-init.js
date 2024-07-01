print("Starting initialization script...");

db = db.getSiblingDB('admin');
db.createUser({
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: [{ role: 'root', db: 'admin' }]
});
print("Root user created.");

db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
db.createUser({
    user: process.env.MONGO_USER,
    pwd: process.env.MONGO_PASSWORD,
    roles: [{ role: 'readWrite', db: process.env.MONGO_DATABASE }]
});
print("Application user created.");

print("Initialization script completed.");
