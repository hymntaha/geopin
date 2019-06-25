const { ApolloServer } = require('apollo-server');

const mongoose = require('mongoose');


const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const {findOrCreateUser} = require('./controllers/userController');
const db = require('./config/keys_dev').mongoURI;


mongoose
  .connect(
    db,
    { useNewUrlParser: true },
  )
  .then(() => console.log('DB connected!'))
  .catch(err => console.log(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({req}) => {
    let authToken = null
    let currentUser = null
    try{
      authToken = req.headers.authentication
      if (authToken) {
       currentUser = await findOrCreateUser(authToken)
      }
    } catch (err){
      console.error(`Unable to authenticate user with token ${authToken}`)
    }
    return { currentUser }
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
