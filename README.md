# gatsby-source-twitter

Source plugin for pulling threads into Gatsby from Twitter Search API.
Useful for creating blog posts out of Twitter threads.

## Example
See [gatsby-twitter-threads-demo](https://github.com/michaelmang/gatsby-twitter-threads-demo) as an example of creating blog posts using this plugin.

## How to use

### Install
```bash
yarn install gatsby-source-twitter-threads
```

### Get API Access
To start using this plugin you have to create an [App on the developer portal](https://developer.twitter.com/en/apps) and then provide the `consumer_key` (API Key), `consumer_secret` (API Secret), and the handle (without the `@`) in the `gatsby-config.js` file:

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-twitter-threads`,
      options: {
        credentials: {
          consumer_key: "INSERT_HERE_YOUR_CONSUMER_KEY",
          consumer_secret: "INSERT_HERE_YOUR_CONSUMER_SECRET",
        },
        user: `my-twitter-handle`,
      },
    },
  ],
}
```

- **credentials**: API Key and API Secret from Twitter Developer Portal.
- **user**: Twitter handle for your account.

## How to query your conversations using GraphQL

### Get All Conversations/Threads
```graphql
query GetAllConversations {
  allTwitterConversation {
    nodes {
      id
      text
    }
  }
}
```

### Get Single Conversation/Thread
```graphql
  query GetConversation($id: String!) {
    twitterConversation(id: {eq: $id}) {
      id
      text
    }
  }
```

## Limitations
Currently, Twitter only allows searching the entire Tweet archive when the app is for "Academic Purposes."
This will only provide the conversations from the past 7 days.

### Potential Workaround
While this is not implemented in this package, a workaround to this limitation would be to fork the `gatsby-node.js` file and do the following:

1. Ensure you have a database that can store the entire thread archive from this point going forward (and an API to interact with it).
2. Before calling `createNodes` (after getting the latest threads), post the latest threads to the database (via a POST request).
3. Then, fetch all the conversations from the database (via a GET request).
4. Finally, call `createNodes` with the entire archive of threads (not just the latest ones returned by the Twitter client).