/** @format */

import { buildSchema } from "graphql";

// Construct a schema, using GraphQL schema language
// Ideally would use new GraphQLSchema({ ... }) generate schemas or apollo
export const schema = buildSchema(`
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
