/* eslint-disable no-param-reassign */
import axios from 'axios';
import parse from './parsing';
import { addProxy } from './utils';

const getNewPosts = (state) => {
  const { feeds } = state.data;

  const old = state.data.posts;
  const promise = feeds.map(({ url, id }) => axios.get(addProxy(url)).then((feedData) => {
    const [, posts] = parse(feedData.data);
    const onlyFeedPosts = old.filter((post) => post.feedId === id);
    const postsLinks = onlyFeedPosts.map((post) => post.link);
    const newPosts = posts.filter((post) => !postsLinks.includes(post.link));
    newPosts.forEach((post) => {
      post.feedId = id;
    });
    if (newPosts.length > 0) {
      state.data.posts = [...newPosts, ...old];
    }
  }));

  Promise.all(promise).finally(() => setTimeout(() => getNewPosts(state), 15000));
};

export default getNewPosts;
