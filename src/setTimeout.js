/* eslint-disable no-param-reassign */
import axios from 'axios';
import parse from './parsing.js';
import { parseRss } from './formatter.js';
import findId from './findId.js';

const updator = (state) => {
  const { urls } = state.feeds;
  const feeds = state.feeds.listOfFeeds;
  const newCheck = [];
  const old = state.posts.flat();
  const corsApiHost = 'https://cors-anywhere.herokuapp.com/';
  const promise = urls.map((url) => axios.get(`${corsApiHost}${url}`));
  Promise.all(promise)
    .then((ar) => ar.forEach((re) => {
      const parsed = parse(re.data);
      const [feed, posts] = parseRss(parsed);
      const id = findId(feeds, feed);
      old.forEach((oldPost) => oldPost.postId = id);
      posts.forEach((post) => newCheck.push(post));
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
          state.posts = [...old, ...newPost];
        }
      }
    })
    .then(() => {
      setTimeout(() => updator(state), 5000);
    })
    .catch((err) => {
      console.log(err);
      state.error = 'network';
    });
};

export default updator;
