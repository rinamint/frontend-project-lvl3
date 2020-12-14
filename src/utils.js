/* eslint-disable no-param-reassign */

export const addProxy = (link) => {
  const corsApiHost = 'https://cors-anywhere.herokuapp.com/';
  return `${corsApiHost}${link}`;
};

export const updateDataState = (data, state, link) => {
  const { channel, posts } = data;
  state.data.posts.unshift(...posts);
  state.data.feeds.unshift({ ...channel, url: link });
};
