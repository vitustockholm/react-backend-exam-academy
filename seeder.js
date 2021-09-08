import mongoose from 'mongoose';
import User from './models/userModel.js';
import Car from './models/carModel.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    let user = {
      name: 'test',
      surname: 'test',
      email: 'test@email.com',
      password: 'test',
    };

    let cars = [
      { make: 'Audi', model: 'A6', year: 2020, price: 40000 },
      { make: 'Audi', model: 'A5', year: 2015, price: 30000 },
    ];

    User.insertMany(user);
    Car.insertMany(cars);

    console.log('Data sended to MongoDB');
  });
