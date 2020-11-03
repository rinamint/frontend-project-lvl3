/* eslint-disable no-param-reassign */
import _ from 'lodash';

const parseFeed = (doc, watchedState) => {
  const channelTitle = doc.querySelector('channel > title');
  const id = _.uniqueId();
  const feed = { channelId: id, channelName: channelTitle.innerHTML };
  watchedState.feeds.activeId = id;
  const posts = doc.querySelectorAll('item');
  console.log(posts);
  posts.forEach((post) => {
    const title = post.querySelector('title');
    const link = post.querySelector('link');
    watchedState.posts.push({ postId: id, title: title.innerHTML, link: link.innerHTML });
  });
  watchedState.feeds.listOfFeeds.push(feed);
};

export default parseFeed;
