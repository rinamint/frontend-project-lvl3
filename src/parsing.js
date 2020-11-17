export default (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const channelTitle = doc.querySelector('channel > title');
  const description = doc.querySelector('channel > description');
  const channel = { channelName: channelTitle.textContent, description: description.textContent };
  const rssPosts = doc.querySelectorAll('item');
  const arrayOfPosts = Array.from(rssPosts).map((post) => {
    const title = post.querySelector('title');
    const link = post.querySelector('link');
    return { title: title.textContent, link: link.textContent };
  });
  return [channel, arrayOfPosts];
};
