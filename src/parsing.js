export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  if (doc.querySelector('parsererror')) {
    throw new Error('ParsingError');
  }
  const name = doc.querySelector('channel > title');
  const desc = doc.querySelector('channel > description');
  const channel = { channelName: name.textContent, description: desc.textContent };
  const rssPosts = doc.querySelectorAll('item');
  const posts = Array.from(rssPosts).map((post) => {
    const title = post.querySelector('title').textContent;
    const link = post.querySelector('link').textContent;
    const description = post.querySelector('description').textContent;
    return {
      title, link, description,
    };
  });
  return { channel, posts };
};
