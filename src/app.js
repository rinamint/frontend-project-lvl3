/* eslint-disable no-param-reassign */
import * as yup from 'yup';
import onChange from 'on-change';
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
import _ from 'lodash';

// const yup = !y.object ? y.default : y;

const schema = yup.object().shape({
  url: yup.string().url(),
});

const updateValidationState = (watchedState) => {
  try {
    schema.validateSync(watchedState.form.inputValue, { abortEarly: false });
    watchedState.form.isValid = true;
    watchedState.form.errors = {};
  } catch (e) {
    // renderErrors(e.inner, elements)
    console.log(e.inner);
    watchedState.form.errors = e.inner;
    watchedState.form.isValid = false;
    console.log(watchedState.form.errors);
  }
};

const removeClasses = (element, feedback) => {
  element.classList.remove('is-invalid');
  if (feedback !== null) {
    feedback.remove();
  }
};

const renderErrors = (errors, elements) => {
  const feedbacks = document.querySelector('.invalid-feedback');
  if (_.isEqual(errors, {})) {
    removeClasses(elements.input, feedbacks);
    return;
  }
  removeClasses(elements.input, feedbacks);
  errors.forEach((error) => {
    const text = error.errors;
    console.log(error);
    // console.log(path)
    const element = elements.input;
    const parent = element.parentElement;
    element.classList.add('is-invalid');
    const feedback = document.createElement('div');
    feedback.classList.add('invalid-feedback');
    feedback.textContent = text;
    parent.append(feedback);
  });
};

export default () => {
  const state = {
    form: {
      isValid: true,
      inputValue: {
        url: '',
      },
      errors: {},
    },
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#add'),
  };
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.errors') {
      console.log('value');
      renderErrors(value, elements);
    }
  });
  elements.input.addEventListener('input', (e) => {
    e.preventDefault();
    watchedState.form.inputValue.url = e.target.value;
    updateValidationState(watchedState, schema, elements);
  });
};
