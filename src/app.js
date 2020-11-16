/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import { addProxy, updateState } from './utils';
import parse from './parsing';
import view from './view';
import resources from './locales';
import update from './setTimeout';

let isValid;
const updateValidationState = (watcher, link) => {
  const listOfUrls = watcher.feeds.listOfFeeds.map((feed) => feed.link);
  const schema = yup.object().shape({
    url: yup.string().required().url().notOneOf(listOfUrls, 'feed'),
  });
  try {
    schema.validateSync({ url: link }, { abortEarly: false });
    watcher.error = '';
    isValid = true;
  } catch (e) {
    watcher.error = e.message;
    isValid = false;
  }
};

export default () => {
  const state = {
    form: {
      state: 'filling',
    },
    error: '',
    feeds: {
      NumOfLastAdded: 0,
      listOfFeeds: [],
    },
    posts: [],
  };

  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  })
    .then(() => {
      const watchedState = view(state);
      const form = document.querySelector('form');
      update(watchedState);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const link = formData.get('url');
        updateValidationState(watchedState, link);
        if (isValid) {
          watchedState.form.state = 'proccesing';
          axios.get(addProxy(link))
            .then((response) => {
              const data = parse(response.data);
              updateState(data, watchedState, link);
              watchedState.form.state = 'proccessed';
            })
            .catch((error) => {
              watchedState.error = error.message;
              watchedState.form.state = 'failed';
            });
        }
      });
    });
};
