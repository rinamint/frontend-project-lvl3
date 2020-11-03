import onChange from 'on-change';
import _ from 'lodash';
import i18next from 'i18next';

const input = document.querySelector('#add');
const state = {
  form: {
    isValid: true,
    inputValue: {
      url: '',
    },
  },
  error: [],
  feeds: {
    activeId: null,
    listOfFeeds: [],
    urls: [],
  },
  posts: [],

};

const removeClasses = (element, feedback) => {
  element.classList.remove('is-invalid');
  if (feedback !== null) {
    feedback.remove();
  }
};

const renderErrors = (error, input) => {
  const feedbacks = document.querySelector('.invalid-feedback');
  if (_.isEqual(error, [])) {
    removeClasses(input, feedbacks);
    return;
  }
  removeClasses(input, feedbacks);
  const text = error === 'feed' ? i18next.t('form.error.feed') : i18next.t('form.error.url');
  const element = input;
  const parent = element.parentElement;
  element.classList.add('is-invalid');
  const feedback = document.createElement('div');
  feedback.classList.add('invalid-feedback');
  feedback.textContent = text;
  parent.append(feedback);
};

const watchedState = onChange(state, (path, value) => {
  const div = document.querySelector('.feeds');
  const h2 = document.createElement('h2');
  const feed = document.createElement('div');
  if (path === 'error') {
    renderErrors(value, input);
  }
  if (path === 'feeds.listOfFeeds') {
    const activeFeed = state.feeds.listOfFeeds.flatMap(({ channelId, channelName }) => {
      //  console.log(channelName, channelId);
      if (channelId === state.feeds.activeId) {
        return channelName;
        }
        return [];
      });
      const p = state.posts.flatMap(({ postId, title, link }) => {
        if (postId === state.feeds.activeId) {
          return `<div><a href="${link}">${title}</a></div>`;
        }
        return [];
      });
      console.log(p)
      feed.innerHTML = p.join('');
      h2.innerHTML = activeFeed.join('');
      feed.prepend(h2)
      div.append(feed);
    }
});

export default watchedState;
