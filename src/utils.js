/* eslint-disable no-param-reassign */
export const findNum = (listOfFeeds, newFeed) => {
  const num = listOfFeeds.flatMap((feed) => {
    if (feed.channelName === newFeed.channelName) {
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
  const newPosts = posts.map((post) => post);
  const newChannel = { ...channel };
  const numberInLine = state.feeds.numOfLastAdded;
  newChannel.channelNumber = numberInLine + 1;
  newPosts.forEach((post) => {
    post.postNumber = numberInLine + 1;
  });
  return [newChannel, newPosts];
};

export const updateDataState = (data, state, link) => {
  const [channel, posts] = data;
  const [newChannel, newPosts] = addNumbers(state, channel, posts);
  state.data.posts.push(...newPosts);
  state.data.feeds.push({ ...newChannel, link });
  state.feeds.numOfLastAdded = newChannel.channelNumber;
};
