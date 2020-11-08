import onChange from 'on-change';
import _ from 'lodash';
import i18next from 'i18next';

const input = document.querySelector('#add');

const removeClasses = (element, feedback, value) => {
  element.classList.remove(value);
  if (feedback !== null) {
    feedback.remove();
  }
};

const buildText = (key, attribute) => {
  const text = i18next.t(`${key}`);
  const div = document.createElement('div');
  div.classList.add(attribute);
  div.innerHTML = text;
  return div;
};

const renderErrors = (error, element) => {
  const invalidFeedback = document.querySelector('.invalid-feedback');
  if (_.isEqual(error, [])) {
    removeClasses(input, invalidFeedback, 'is-invalid');
    return;
  }
  removeClasses(element, invalidFeedback, 'is-invalid');
  let newFeedback;
  switch (error) {
    case 'feed':
      newFeedback = buildText('form.error.feed', 'invalid-feedback');
      break;
    case 'url':
      newFeedback = buildText('form.error.url', 'invalid-feedback');
      break;
    case 'network':
      newFeedback = buildText('form.error.network', 'invalid-feedback');
      break;
    default:
      newFeedback = buildText('form.error.unknown', 'invalid-feedback');
  }
  const parent = element.parentElement;
  element.classList.add('is-invalid');
  parent.append(newFeedback);
};

const feed = document.querySelector('.feeds');
const feedHeading = document.createElement('h2');
const postsHeading = document.createElement('h2');
feedHeading.innerHTML = 'FEEDS';
postsHeading.innerHTML = 'POSTS';
const posts = document.querySelector('.posts');
const ulFeeds = document.querySelector('.feed-list');
const ulPosts = document.querySelector('.post-list');

const watchedState = (state) => onChange(state, (path, value) => {
  if (path === 'error') {
    renderErrors(value, input);
  }
  if (path === 'feeds.listOfFeeds') {
    const lastAdded = state.feeds.listOfFeeds.flatMap(({ channelId, channelName }) => {
      if (channelId > state.feeds.activeId) {
        return channelName.split('<!');
      }
      return [];
    });
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = lastAdded.join('');
    ulFeeds.prepend(li);
    feed.append(feedHeading);
    feed.append(ulFeeds);
  }
  if (path === 'posts') {
    value.flat().forEach(({ postId, title, link }) => {
      if (Number(postId) > Number(state.feeds.activeId)) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.innerHTML = `<a href="${link}">${title.split('<')}</a>`;
        ulPosts.prepend(li);
      }
    });
    posts.append(postsHeading);
    posts.append(ulPosts);
  }
});
export default watchedState;
