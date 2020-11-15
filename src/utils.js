export const findId = (listOfFeeds, newFeed) => {
  const id = listOfFeeds.flatMap((feed) => {
    if (feed.channelName === newFeed.channelName) {
      return feed.channelId;
    }
    return [];
  });
  return id.join('');
};

export const addProxy = (link) => {
  const corsApiHost = 'https://cors-anywhere.herokuapp.com/';
  return `${corsApiHost}${link}`;
};
