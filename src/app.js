/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import { addProxy, updateDataState } from './utils';
import parse from './parsing';
import view from './view';
import resources from './locales';
import update from './setTimeout';

const validate = (watcher, link) => {
  const listOfUrls = watcher.feeds.listOfFeeds.map((feed) => feed.link);
  const schema = yup.object().shape({
    url: yup.string().required().url().notOneOf(listOfUrls, 'feed'),
  });
  try {
    schema.validateSync({ url: link }, { abortEarly: false });
    watcher.form.error = '';
  } catch (e) {
    watcher.form.error = e.message;
  }
};

export default () => {
  const state = {
    form: {
      state: 'filling',
      error: '',
    },
    feeds: {
      numOfLastAdded: 0,
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
        validate(watchedState, link);
        if (_.isEqual(watchedState.form.error, '')) {
          watchedState.form.state = 'proccesing';
          axios.get(addProxy(link))
            .then((response) => {
              const data = parse(response.data);
              updateDataState(data, watchedState, link);
              watchedState.form.state = 'proccessed';
            })
            .catch((error) => {
              watchedState.form.error = error.message;
              watchedState.form.state = 'failed';
            });
        }
      });
    });
};
