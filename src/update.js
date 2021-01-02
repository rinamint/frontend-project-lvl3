/* eslint-disable no-param-reassign */
import axios from 'axios';
import _ from 'lodash';
import parse from './parsing';
import addProxy from './utils';

const getNewPosts = (state) => {
  const { feeds } = state.data;

  const oldPosts = state.data.posts;
  const promises = feeds.map(({ url, id }) => axios.get(addProxy(url)).then((feedData) => {
    const { posts } = parse(feedData.data);
    const onlyFeedPosts = oldPosts.filter((post) => post.feedId === id);
    const newPosts = _.differenceBy(posts, onlyFeedPosts, 'link')
      .map((post) => ({ ...post, feedId: id }));
    state.data.posts.unshift(...newPosts);
  }));

  Promise.allSettled(promises).finally(() => setTimeout(() => getNewPosts(state), 15000));
};

export default getNewPosts;
