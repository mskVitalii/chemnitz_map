db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE)

console.log("[mongo-init] create user")

db.createUser({
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: [
        {
            role: 'root',
            db: "admin",
        },
        {
            role: 'dbOwner',
            db: process.env.MONGO_INITDB_DATABASE,
        },
    ],
});

console.log("[mongo-init] user created")