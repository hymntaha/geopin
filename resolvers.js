const { AuthenticationError } = require('apollo-server');
const Pin = require('./models/pin');

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError('You must be logged in');
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    getPins: async (root, args, ctx) => {
      const pins = await Pin.find({}).populate('comments.author');
      return pins;
    },
  },
  Mutation: {
    createPin: authenticated(async (roor, args, ctx) => {
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id,
      }).save();
      const pinAdded = await Pin.populate(newPin, 'author');
      return pinAdded;
    }),
    deletePin: authenticated(async (roor, args, ctx) => {
      const PinDeleted = await Pin.findOneAndDelete({ _id: args.pinId }).exec();
      return pinDeleted;
    }),
    createComment: authenticated(async (root, args, ctx) => {
      const newComment = { text: args.text, author: ctx.currentUser._id };
      const pinUpdated = await Pin.findOneAndUpdate(
        { _id: args.pinId },
        { $push: { comments: newComment } },
        { new: true },
      )
        .populate('author')
        .populate('comments.author');
      return pinUpdated;
    }),
  },
};
