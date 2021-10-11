const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async ( parent, args, context) => {
      if (context.User){
        const user = await User.findById({ _id: context.user.id }).populate({
          path: 'user.books',
          populate: 'books',
        });
        return user;
      }
    },
   
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    createUser: async (parent, { name, email, password }) => {
      const User = await User.create({ name, email, password });
      const token = signToken(user);

      return { token, User };
    },
    login: async (parent, { email, password }) => {
      const User = await User.findOne({ email });

      if (!User) {
        throw new AuthenticationError('No User with this email found!');
      }

      const correctPw = await User.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(User);
      return { token, User };
    },
    
  },
};

module.exports = resolvers;
