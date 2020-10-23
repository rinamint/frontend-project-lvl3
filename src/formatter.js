/* eslint-disable no-param-reassign */
import _ from 'lodash';

const parseFeed = (doc, watchedState) => {
  const channel = doc.querySelector('channel > title');
  const id = _.uniqueId();
  console.log(channel);
  const feed = { channelId: id, channelName: channel.innerHTML };
  watchedState.feeds.activeId = id;
  watchedState.feeds.listOfFeeds.push(feed);
  const posts = doc.querySelectorAll('item');
  console.log(posts);
  posts.forEach((post) => {
    const title = post.querySelector('title');
    const link = post.querySelector('link');
    watchedState.posts.push({ PostId: id, title: title.innerHTML, link: link.innerHTML });
  });
};

export default parseFeed;
