const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
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
     addUser: async (parent, { name, email, password }) => {
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
     saveBook: async (parent, {bookId, title, authors, description, image, link}) => {
          const bookData = await Book.create({ bookId, title, authors, description, image, link })
          if(!bookData){
               return "there was an error";
          }
     }
     
   }
//
}

module.exports = resolvers;