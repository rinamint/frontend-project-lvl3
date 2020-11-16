/* eslint-disable no-param-reassign */
export const findNum = (listOfFeeds, newFeed) => {
  const num = listOfFeeds.flatMap((feed) => {
    if (feed.link === newFeed.link) {
      return feed.channelNumber;
    }
    return [];
  });
  return num.join('');
};

export const addProxy = (link) => {
  const corsApiHost = 'https://cors-anywhere.herokuapp.com/';
  return `${corsApiHost}${link}`;
};

export const addNumbers = (state, channel, posts) => {
  const numberInLine = state.feeds.NumOfLastAdded;
  channel.channelNumber = numberInLine + 1;
  posts.forEach((post) => {
    post.postNumber = numberInLine + 1;
  });
};

export const updateState = (data, state, link) => {
  const [channel, arrayOfPosts] = data;
  addNumbers(state, channel, arrayOfPosts);
  channel.link = link;
  state.feeds.listOfFeeds.push(channel);
  state.posts.push(arrayOfPosts.flat());
  state.feeds.NumOfLastAdded = channel.channelNumber;
};
