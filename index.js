const express = require("express");
const mongoose = require("mongoose");
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, SESSION_SECRET, REDIS_URL, REDIS_PORT } = require("./config/config");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const redis = require('redis');
const session = require('express-session');

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
});
const cors = require("cors");

const app = express();
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
const connectWithRetry = () => {
    mongoose.connect(mongoURL, 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        .then(() => {console.log("succesfully connected to DB!")})
        .catch((e) => {
            console.log(e);
            setTimeout(() => {
                connectWithRetry();
            }, 5000)
        });
};

connectWithRetry();
app.use(express.json());
app.enable("trust proxy");
app.use(
    session({
      store: new RedisStore({ client: redisClient }),

      secret: SESSION_SECRET,
      cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 60000
      }
      
    })
  );

  app.use(cors({}));

app.get("/api/v1", (req, res) =>
{
    res.send("<h2>Hi There!</h2>");
});

//localhost:3000/api/v1/posts
app.use("/api/v1/posts", postRouter);

//localhost:3000/api/v1/signup
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));