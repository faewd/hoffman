import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://fivee.co/graphql',
  cache: new InMemoryCache({
    possibleTypes: {
      Item: ["WeaponItem", "ArmorItem", "ToolsItem", "GearItem", "StackItem", "PackItem"]
    }
  }),
});

export default client;
