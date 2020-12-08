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

const validateForm = (watcher, link) => {
  const urls = watcher.data.feeds.map((feed) => feed.url);
  const schema = yup.object().shape({
    url: yup.string().required().url(i18next.t('form.error.url')).notOneOf(urls, i18next.t('form.error.duplicate')),
  });
  try {
    schema.validateSync({ url: link }, { abortEarly: false });
    return '';
  } catch (e) {
    if (e.message === 'URL has been added') {
      return 'form.error.duplicate';
    }
    if (e.message === 'url must be a valid URL') {
      return 'form.error.url';
    }
    if (e.message === 'Network Error') {
      return 'form.error.network';
    }
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
      viewedPosts: [],
      feeds: [],
    },
    feeds: {
      numOfLastAdded: 0,
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
      const form = document.querySelector('form');
      update(watchedState);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const link = formData.get('url');
        watchedState.form.error = validateForm(watchedState, link);
        if (_.isEqual(watchedState.form.error, '')) {
          watchedState.form.state = 'proccesing';
          axios.get(addProxy(link))
            .then((response) => {
              const data = parse(response.data);
              updateDataState(data, watchedState, link);
              watchedState.form.state = 'proccessed';
            })
            .catch((error) => {
              const { message } = error;
              watchedState.form.error = message === 'Request failed with status code 404' ? 'form.error.parsing' : 'form.error.network';
              watchedState.form.state = 'failed';
            });
        } else {
          watchedState.form.state = 'failed';
        }
      });
    });
};
