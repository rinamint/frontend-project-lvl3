/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import { addProxy, updateDataState } from './utils';
import parse from './parsing';
import view from './view';
import resources from './locales';
import update from './update';

const validateForm = (feeds, link) => {
  const urls = feeds.map((feed) => feed.url);
  const rssLinkSchema = yup.string().required().url('form.error.url').notOneOf(urls, 'form.error.duplicate');
  try {
    rssLinkSchema.validateSync(link, { abortEarly: false });
    return '';
  } catch (e) {
    return e.message;
  }
};
export default () => {
  const state = {
    form: {
      state: 'filling',
      error: '',
    },
    data: {
      posts: [],
      feeds: [],
    },
    ui: {
      modal: {
        current: null,
        descriptions: {},
        viewedPosts: new Set(),
      },
      links: {
        current: null,
        pressedLinks: new Set(),
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
      };
      const watchedState = view(state, elements);
      update(watchedState);
      elements.posts.addEventListener('click', (e) => {
        const { target } = e;
        const isModal = target.getAttribute('data-toggle') === 'modal';
        if (isModal) {
          const current = target.closest('li');
          watchedState.ui.modal.current = current;
        } else {
          watchedState.ui.links.current = target;
        }
      });

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const link = formData.get('url');
        const error = validateForm(watchedState.data.feeds, link);
        if (_.isEqual(error, '')) {
          watchedState.form.state = 'proccesing';
          axios.get(addProxy(link))
            .then((response) => {
              const data = parse(response.data);
              updateDataState(data, watchedState, link);
              watchedState.form.state = 'proccessed';
            })
            .catch((err) => {
              const { message } = err;
              watchedState.form.error = message === 'parsing' ? 'form.error.parsing' : 'form.error.network';
              watchedState.form.state = 'failed';
            });
        } else {
          const isAdded = watchedState.form.error === error;
          if (isAdded) {
            return;
          }
          watchedState.form.state = 'failed';
          watchedState.form.error = error;
        }
      });
    });
};
