const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
     Query: {
      me: async (parent, args, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id });
        }
        throw new AuthenticationError('You need to be logged in!');
      },
      users: async () => {
       
          const user = await User.findById({}).populate({
            path: 'user.books',
            populate: 'books',
          });
          return user;
      
     },
     user: async( parent, args, context) => {
      if (context.User){
        const user = await User.findById({ _id: context.user.id }).populate({
          path: 'user.books',
          populate: 'books',
        });
        return user;
      }
     }
    
     
   },
   Mutation: {
     addUser: async (parent, args) => {
       const User = await User.create(args);
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
     saveBook: async (parent, { bookData }, context) => {
        if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: bookData } },
                { new: true, runValidators: true }
            );

            return updatedUser;
        }

        throw new AuthenticationError('There was a request error...');
    },
    removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            );

            return updatedUser;
        }
        throw new AuthenticationError('You need to be logged in!');
    }
     
   }
//
}

module.exports = resolvers;