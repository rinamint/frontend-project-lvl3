/* eslint-disable no-param-reassign */
import axios from 'axios';
import parse from './parsing';
import { addProxy } from './utils';

const getNewPosts = (state) => {
  const { feeds } = state.data;

  const oldPosts = state.data.posts;
  const promises = feeds.map(({ url, id }) => axios.get(addProxy(url)).then((feedData) => {
    const { posts } = parse(feedData.data);
    const onlyFeedPosts = oldPosts.filter((post) => post.feedId === id);
    const postsLinks = onlyFeedPosts.map((post) => post.link);
    const gottenPosts = posts.filter((post) => !postsLinks.includes(post.link));
    const newPosts = gottenPosts.map((post) => {
      const newPost = { ...post, feedId: id };
      return newPost;
    });
    if (newPosts.length > 0) {
      state.data.posts = [...newPosts, ...oldPosts];
    }
  }));

  Promise.allSettled(promises).finally(() => setTimeout(() => getNewPosts(state), 15000));
};

export default getNewPosts;
