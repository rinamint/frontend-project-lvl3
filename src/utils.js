/* eslint-disable no-param-reassign */
export const findId = (listOfFeeds, newFeed) => {
  const id = listOfFeeds.flatMap((feed) => {
    if (feed.channelName === newFeed.channelName) {
      return feed.channelNumber;
    }
    return [];
  });
  return id.join('');
};

export const addProxy = (link) => {
  const corsApiHost = 'https://cors-anywhere.herokuapp.com/';
  return `${corsApiHost}${link}`;
};

export const addNumbers = (state, channel, posts) => {
  const numberInLine = state.feeds.lastAdded;
  channel.channelNumber = numberInLine + 1;
  posts.forEach((post) => {
    post.postNumber = numberInLine + 1;
  });
};
