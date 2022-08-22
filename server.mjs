import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

// let userBase = [];
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  createdOn: { type: Date, default: Date.now },
});
const userModel = mongoose.model("user", userSchema);

app.post("/signup", (req, res) => {
  let body = req.body;

  if (!body.firstName || !body.lastName || !body.email || !body.password) {
    res.status(400).send(
      `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
    );
    return;
  }

  // let isFound = false;

  // for (let i = 0; i < userBase.length; i++) {
  //   if (userBase[i].email === body.email.toLowerCase()) {
  //     isFound = true;
  //     break;
  //   }
  // }
  // if (isFound) {
  //   res.status(400).send({
  //     message: `email ${body.email} already exist.`,
  //   });
  //   return;
  // }

  let newUser = new userModel({
    // userId: nanoid(),
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email.toLowerCase(),
    password: body.password,
  });

  newUser.save((err, result) => {
    if (!err) {
      res.status(201).send({ message: "user is created" });
    } else {
      console.log("db error", err);
      res.status(500).send("error");
    }
  });

  // userBase.push(newUser);
  console.log(userBase, "userBase");

  // res.status(201).send({ message: "user is created" });
});

app.post("/login", (req, res) => {
  let body = req.body;

  if (!body.email || !body.password) {
    res.status(400).send(
      `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
    );
    return;
  }

  let isFound = false;

  for (let i = 0; i < userBase.length; i++) {
    if (userBase[i].email === body.email) {
      isFound = true;
      if (userBase[i].password === body.password) {
        res.status(200).send({
          firstName: userBase[i].firstName,
          lastName: userBase[i].lastName,
          email: userBase[i].email,
          message: "login successful",
        });
        return;
      } else {
        // password incorrect

        res.status(401).send({
          message: "incorrect password",
        });
        return;
      }
    }
  }

  if (!isFound) {
    res.status(404).send({
      message: "user not found",
    });
    return;
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

let dbURI =
  "mongodb+srv://tabish:1234@cluster0.wtc3jvl.mongodb.net/loginform?retryWrites=true&w=majority";
mongoose.connect(dbURI);
mongoose.connection.on("connected", function () {
  console.log("Mongoose is connected");
});
mongoose.connection.on("disconnected", function () {});
mongoose.connection.on("error", function (err) {});
mongoose.connection.on("SIGINT", function () {});
