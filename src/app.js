/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import addProxy from './utils';
import parse from './parsing';
import view from './view';
import resources from './locales';
import update from './update';

const validateForm = (feeds, link) => {
  const urls = feeds.map((feed) => feed.url);
  const rssLinkSchema = yup.string().required().url('url').notOneOf(urls, 'duplicate');
  try {
    rssLinkSchema.validateSync(link, { abortEarly: false });
    return null;
  } catch (e) {
    return e.message;
  }
};
export default () => {
  const state = {
    form: {
      state: 'filling',
      error: null,
    },
    data: {
      posts: [],
      feeds: [],
    },
    modal: {
      currentModal: null,
    },
    ui: {
      viewed: {
        viewedPosts: new Set(),
      },
    },
  };

  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  })
    .then(() => {
      const elements = {
        input: document.querySelector('#add'),
        button: document.querySelector('.btn-add'),
        form: document.querySelector('form'),
        feed: document.querySelector('.feeds'),
        posts: document.querySelector('.posts'),
        ulFeeds: document.querySelector('.feed-list'),
        ulPosts: document.querySelector('.post-list'),
        modal: document.querySelector('#modal'),
        feedback: document.querySelector('.feedback'),
      };
      const watchedState = view(state, elements);
      update(watchedState);
      elements.posts.addEventListener('click', (e) => {
        const { target } = e;
        const isModal = target.dataset.toggle === 'modal';
        const { id } = target.dataset;
        if (!id) {
          return;
        }
        watchedState.ui.viewed.viewedPosts.add(id);
        if (isModal) {
          watchedState.ui.viewed.viewedPosts.add(id);
          watchedState.modal.currentModal = id;
        }
      });

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        watchedState.form.state = 'processing';
        const link = formData.get('url');
        const error = validateForm(watchedState.data.feeds, link);
        watchedState.form.error = error;
        if (error) {
          watchedState.form.state = 'failed';
          return;
        }
        axios.get(addProxy(link))
          .then((response) => {
            const data = parse(response.data);
            const { channel, posts } = data;
            watchedState.data.posts.unshift(...posts);
            watchedState.data.feeds.unshift({ ...channel, url: link });
            watchedState.form.state = 'proccessed';
          })
          .catch((err) => {
            const { message } = err;
            switch (message) {
              case 'parsing':
                watchedState.form.error = 'parsing';
                break;
              case 'Network Error':
                watchedState.form.error = 'network';
                break;
              default:
                watchedState.form.error = 'unknown';
            }
            watchedState.form.state = 'failed';
          });
      });
    });
};
