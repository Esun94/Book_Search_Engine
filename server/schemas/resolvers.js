const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models')
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async function (parent, args, context) {
            if (context.user._id) {
                const foundUser = await User.findOne({
                    _id: context.user._id
                }).select('-__v -password')
                return userData;
            }

            throw new AuthenticationError('Not Logged In')

        }
    },

    Mutation: {
        addUser: async function (parent, args) {
            console.log("args:", args);

            return // ({ token, user })
     

        },

        login: async function (parent, { email, password }) {
            //TODO: find the user with input email
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Incorrect Credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect Credentials');
            }
            const token = signToken(user);
            return ({ token, user });
        },

        saveBook: async function (parent, { bookData }, context) {
            console.log("savedbook:", context.user)
            const book = {...args}
            if (context.user) {
                //TODO: args.book
                const user = await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {saveBooks: book}},
                    {new: true}
                )

                return user//TODO data to return
            }
            throw new AuthenticationError("You must be logged in!")
        },

        removeBook: async function (parents, args, context) {
            //TODO args.bookId
            if (context.user) {
                // TODO

                return // DATA to return
            }
        }
    }
}

module.exports = resolvers;