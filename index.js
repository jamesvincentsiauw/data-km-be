const {ApolloServer} = require('apollo-server');
const {loadFile} = require('graphql-import-files');
const resolver = require('./schema/resolver');

const server = new ApolloServer({
  typeDefs: loadFile('./schema/typedefs.gql'),
  resolvers: resolver,
});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
