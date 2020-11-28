/* eslint-disable no-param-reassign */
import axios from 'axios';
import parse from './parsing';
import { findNum, addProxy, addNumbers } from './utils';

const update = (state) => {
  const urls = state.data.feeds.map((feed) => feed.link);
  const { feeds } = state.data;
  const old = state.data.posts;
  const promise = urls.map((url) => axios.get(addProxy(url)));

  Promise.all(promise)
    .then((data) => data.forEach((feedData) => {
      const [feed, posts] = parse(feedData.data);
      const [numFeed, numPosts] = addNumbers(state, feed, posts);
      const lineNum = findNum(feeds, numFeed);
      const onlyFeedPosts = old.filter((post) => post.feedId === feed.feedId);
      const postsLinks = onlyFeedPosts.map((post) => post.link);
      onlyFeedPosts.forEach((oldPost) => {
        oldPost.postNumber = Number(lineNum);
      });
      const newPosts = numPosts.flatMap((post) => {
        if (!postsLinks.includes(post.link)) {
          return post;
        }
        return [];
      });
      if (newPosts.length > 0) {
        state.data.posts = [...newPosts, ...old];
      }
    }))
    .then(() => {
      setTimeout(() => update(state), 15000);
    });
};

export default update;
