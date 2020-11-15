import _ from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const channelTitle = doc.querySelector('channel > title');
  const id = _.uniqueId();
  const channel = { channelId: id, channelName: channelTitle.textContent };
  const rssPosts = doc.querySelectorAll('item');
  const arrayOfPosts = Array.from(rssPosts).map((post) => {
    const title = post.querySelector('title');
    const link = post.querySelector('link');
    return { postId: id, title: title.textContent, link: link.innerHTML };
  });
  return [channel, arrayOfPosts];
};

export const updateState = (data, watcher) => {
  const [channel, arrayOfPosts] = data;
  watcher.feeds.listOfFeeds.push(channel);
  watcher.posts.push(arrayOfPosts.flat());
  watcher.feeds.activeId = channel.channelId;
};
