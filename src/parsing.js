export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const name = doc.querySelector('channel > title');
  const desc = doc.querySelector('channel > description');
  const id = name.textContent;
  const channel = { channelName: name.textContent, description: desc.textContent, feedId: id };
  const rssPosts = doc.querySelectorAll('item');
  const posts = Array.from(rssPosts).map((post) => {
    const title = post.querySelector('title');
    const link = post.querySelector('link');
    return { title: title.textContent, link: link.textContent, feedId: id };
  });
  return [channel, posts];
};
