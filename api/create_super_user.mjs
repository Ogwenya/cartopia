/* 
- THIS SCRIPT IS ONLY FOR INITIALIZING FIRST ADMIN IN THE DATABASE
- CAN BE DELETED AFTERWARDS
*/

import bcrypt from 'bcrypt';
import validator from 'validator';
import inquirer from 'inquirer';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
dotenv.config();

const prisma = new PrismaClient();
// validate: firstname, lastname
const validateString = (input) => {
  if (input === '' || input.length < 2) {
    return 'value must be 2 characters or more.';
  }
  return true;
};

// validate email
const validateEmail = async (input) => {
  if (!validator.isEmail(input)) {
    return 'Invalid email';
  }
  return true;
};

// validate password
const validatePassword = (input) => {
  if (input.length < 6) {
    return 'Password should be at least 6 characters long';
  }
  return true;
};

const create_super_user = async (configs) => {
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(configs.password, salt);

    // create user
    const user = {
      firstname: configs.firstname,
      lastname: configs.lastname,
      email: configs.email,
      password: hashedPassword,
      role: 'SUPER_USER',
    };

    // Insert the user document
    const result = await prisma.user.create({
      data: user,
    });

    console.log('\n\nAdmin User created successfully');
    console.log(result);
  } catch (err) {
    console.log(err.message);
  }
};

inquirer
  .prompt([
    {
      name: 'firstname',
      message: 'Enter firstname',
      type: 'input',
      validate: validateString,
    },
    {
      name: 'lastname',
      message: 'Enter lastname',
      type: 'input',
      validate: validateString,
    },
    {
      name: 'email',
      message: 'Enter email',
      type: 'input',
      validate: validateEmail,
    },
    {
      name: 'password',
      message: 'Enter password',
      type: 'password',
      validate: validatePassword,
    },
    {
      name: 'confirm_password',
      message: 'confirm password',
      type: 'password',
      validate: function (value, answers) {
        const password = answers.password;
        if (value === password) {
          return true; // passwords match
        }
        return 'Passwords do not match!';
      },
    },
  ])
  .then((answer) => {
    create_super_user(answer).catch(console.dir);
  });
