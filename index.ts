import express from 'express';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { getRecomendations } from './src/services/RecommendationService';

dotenv.config();

// Construct a schema, using GraphQL schema language
// Ideally would use new GraphQLSchema({ ... }) generate schemas or apollo
var schema = buildSchema(`
    type Attendee {
        userId: String!
    }
    type Program {
        id: String!
        name: String!
        start: String!
        end: String!
        mode: String!
        dimensions: String!
        facilitators: String!
        hobbies: String
        levelsOfCare: String!
        attendees: [Attendee]
    }
    type Query {
        recommendations(startDate: String!, endDate: String!): [Program]
    }
`);

// // The root provides a resolver function for each API endpoint
var root = {
  recommendations: getRecomendations,
};

const app = express();
const port = process.env.PORT;

app.use('/', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
