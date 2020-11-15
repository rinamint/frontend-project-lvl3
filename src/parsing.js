/* eslint-disable no-param-reassign */
import { addNumbers } from './utils';

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const channelTitle = doc.querySelector('channel > title');
  const channel = { channelName: channelTitle.textContent };
  const rssPosts = doc.querySelectorAll('item');
  const arrayOfPosts = Array.from(rssPosts).map((post) => {
    const title = post.querySelector('title');
    const link = post.querySelector('link');
    return { title: title.textContent, link: link.innerHTML };
  });
  return [channel, arrayOfPosts];
};

export const updateState = (data, state) => {
  const [channel, arrayOfPosts] = data;
  addNumbers(state, channel, arrayOfPosts);
  state.feeds.listOfFeeds.push(channel);
  state.posts.push(arrayOfPosts.flat());
  state.feeds.lastAdded = channel.channelNumber;
};
