import _ from 'lodash';

export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const name = doc.querySelector('channel > title');
  const desc = doc.querySelector('channel > description');
  const feedId = _.uniqueId();
  const channel = { channelName: name.textContent, description: desc.textContent, id: feedId };
  const rssPosts = doc.querySelectorAll('item');
  const posts = Array.from(rssPosts).map((post) => {
    const title = post.querySelector('title').textContent;
    const link = post.querySelector('link').textContent;
    const description = post.querySelector('description').textContent;
    return {
      title, link, feedId, description, postId: _.uniqueId(),
    };
  });
  return [channel, posts];
};
