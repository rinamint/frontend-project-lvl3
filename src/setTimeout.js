/* eslint-disable no-param-reassign */
import axios from 'axios';
import parse from './parsing';
import { findNum, addProxy, addNumbers } from './utils';

const update = (state) => {
  const urls = state.feeds.listOfFeeds.map((feed) => feed.link);
  const feeds = state.feeds.listOfFeeds;
  const newCheck = [];
  const old = state.posts.flat();
  const promise = urls.map((url) => axios.get(addProxy(url)));
  Promise.all(promise)
    .then((ar) => ar.forEach((re) => {
      const [feed, posts] = parse(re.data);
      const [numFeed, numPosts] = addNumbers(state, feed, posts);
      const lineNum = findNum(feeds, numFeed);
      old.forEach((oldPost) => {
        oldPost.postNumber = lineNum;
      });
      numPosts.forEach((post) => newCheck.push(post));
    }))
    .then(() => {
      const oldTitles = old.flat().map((element) => element.title);
      if (oldTitles.length > 0) {
        const newPost = newCheck.flatMap((post) => {
          if (!oldTitles.includes(post.title)) {
            return post;
          }
          return [];
        });

        if (newPost.length > 0) {
          state.posts = [...newPost, ...old];
        }
      }
    })
    .then(() => {
      setTimeout(() => update(state), 5000);
    })
    .catch((e) => {
      state.form.error = e.message;
    });
};

export default update;
