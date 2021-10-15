const { filter, groupBy, each, size, reverse, map, head, join } = require('lodash');
const md5 = require('md5');
const Twitter = require('twitter-v2');

function generateNode(tweet, contentDigest, type) {
  const id = md5(tweet.id)

  const nodeData = {
    id,
    children: [],
    parent: `__SOURCE__`,
    internal: {
      type,
      contentDigest,
    },
  }

  return {
    ...nodeData,
    ...tweet,
  };
}

exports.sourceNodes = async function getResults(
  { actions, createContentDigest, reporter },
  { credentials, user }
) {
  if (!credentials) {
    reporter.warn(`No Twitter credentials found. Please check your configuration.`)
    return Promise.resolve();
  }

  const { createNode } = actions

  function createNodes(tweets, nodeType) {
    tweets.forEach((tweet) => {
      createNode(generateNode(tweet, createContentDigest(tweet), nodeType))
    })
  }

  const GET_RECENT_CONVERSATIONS = `tweets/search/recent?query=from:${user}&tweet.fields=conversation_id`

  const client = new Twitter(credentials);
  const nodeType = `twitterConversation`
  const { data } = await client.get(GET_RECENT_CONVERSATIONS);
  const results = map(map(filter(groupBy(data, 'conversation_id'), (x) => size(x) > 1), reverse), (conversation) => ({
    id: head(conversation).conversation_id,
    text: join(map(conversation, ({ text }) => text), '\n'),
  }));

  if (results.length) {
    reporter.info(`Creating Twitter nodes ${nodeType} ...`)
    createNodes(results, nodeType)
  } else { reporter.warn(`No twitter results from search`) }

  return Promise.resolve()
};