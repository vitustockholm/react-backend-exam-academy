import express, { response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';

import User from './models/userModel.js';
import Car from './models/carModel.js';
//
import Vote from './models/voteModel.js';
//
dotenv.config();
const app = express();
const PORT = process.env.PORT;
// Middlewares
app.use(cors());
app.use(express.json());

// Connecting DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((response) => {
    console.log(`Connected to MongoDB`.blue.underline.bold);
    // Starting server
    app.listen(PORT, () =>
      console.log(`Server is running on port ${PORT}...`.yellow.underline.bold)
    );
  });
// Routes
app.get('/', (req, res) => res.send('API is running...')); // main /
// GET: all cars all users all votes
app.get('/api/cars', async (req, res) => {
  let users = await User.find({});
  let cars = await Car.find({});
  let votes = await Vote.find({});
  /////
  let usersAndCars = users.reduce((total, user) => {
    let userCars = cars.filter((car) => car.user_id === '' + user._id);
    let userCarVotes = votes.filter((vote) => vote.user_id === '' + car_id);
    console.log('user is backo', userCarVotes);
    total.push({ ...user.toObject(), cars: [...userCars, userCarVotes] });

    return total;
  }, []);

  res.json(usersAndCars);
});
// GET: get single user based on id
app.get('/api/users/:id', async (req, res) => {
  let userId = req.params.id;

  let user = await User.findById(userId);
  let cars = await Car.find({ user_id: userId });

  res.json({ ...user.toObject(), cars: [...cars] });
});

// POST: register new user
app.post('/api/users/signup', (req, res) => {
  let user = req.body;

  User.find().then((result) => {
    const userExists = result.some(
      (userFromDB) => userFromDB.email === user.email
    );

    if (userExists) {
      res.json({
        registrationStatus: 'failed',
        message: 'User with given email already exists',
      });
    } else {
      user.cars = [];

      const newUser = new User(user);

      newUser.save().then((result) => {
        let { _id } = result;
        res.json({
          registrationStatus: 'success',
          userId: _id,
        });
      });
    }
  });
});

// POST: Log in existing user
app.post('/api/users/login', (req, res) => {
  let user = req.body;

  //validation
  User.find().then((result) => {
    let userFounded = result.find(
      (userFromDB) =>
        userFromDB.email === user.email && userFromDB.password === user.password
    );

    if (userFounded) {
      let { _id } = userFounded;

      res.json({
        loginStatus: 'success',
        userId: _id,
      });
    } else {
      res.status(401).json({
        loginStatus: 'failed',
        message: 'Given email or password is incorrect',
      });
    }
  });
});

// PUT: Delete single car based on it's id (use this route for embeded DB with single collection)
app.put('/api/cars/delete/:id', async (req, res) => {
  let { userId, carId } = req.body;

  let userFromDB = await UserAndCars.findById(userId);

  let carToDeleteIndex = userFromDB.cars.findIndex(
    (car) => '' + car._id === '' + carId
  );

  // updating user data from DB  by removing car
  userFromDB.cars.splice(carToDeleteIndex, 1);

  UserAndCars.findByIdAndUpdate(userId, userFromDB).then((result) =>
    res.json(userFromDB)
  );
});

// PUT: Add single car to user based on his id
app.put('/api/cars/add/:id', async (req, res) => {
  let userId = req.params.id;
  let carInfo = req.body;

  carInfo.user_id = userId;

  let newCar = new Car(carInfo);

  newCar.save();

  let user = await User.findById(userId);
  let cars = await Car.find({ user_id: userId });

  res.json({ ...user.toObject(), cars: [...cars] });
});

// DELETE: Delete single car based on it's id (for listed DB with multiple collections)
app.delete('/api/cars/delete/:id', async (req, res) => {
  const carId = req.params.id;

  const deletedCar = await Car.findByIdAndDelete(carId);

  const user = await User.findById(deletedCar.user_id);
  const cars = await Car.find({ user_id: deletedCar.user_id });

  res.json({ ...user.toObject(), cars: [...cars] });
});

// --------------------------------------------------------------------
// REST API
/*
GET:     /api/cars              | Get all cars
         /api/users/:id         | Get single user based on id

POST:    /api/users/signup      | Register new user
         /api/users/login       | Log in existing user

PUT:     /api/cars/delete/:id   | Delete single car based on it's id (for embeded DB with one collention)
         /api/cars/add/:id      | Add single car to user based on his id

DELETE:  /api/cars/delete/:id   | Delete single car based on it's id (for listed DB with multiple collections)
*/
//---------------------------------------------------------------------
