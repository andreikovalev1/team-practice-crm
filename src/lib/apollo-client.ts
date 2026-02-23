import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/api/graphql';

const client = new ApolloClient({
    link: new HttpLink ({
        uri: graphqlUrl,
    }),
  cache: new InMemoryCache(),
});

export default client;