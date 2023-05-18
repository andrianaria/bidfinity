import i18n from 'i18next';

export default function validate(values) {
  const errors = {};
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,9}$/i;
  const passwordRegex = new RegExp('^(?=.*([a-z]|[A-Z]))(?=.*[0-9])(?=.{8,})');

  if (!values.name) {
    errors.name = i18n.t('signup.error.nameRequired');
  }

  if (!values.email) {
    errors.email = i18n.t('signup.error.emailRequired');
  } else if (!emailRegex.test(values.email)) {
    errors.email = i18n.t('signup.error.invalidEmail');
  }

  if (!values.password) {
    errors.password = i18n.t('signup.error.passwordRequired');
  } else if (values.password && !passwordRegex.test(values.password)) {
    errors.password = i18n.t('signup.error.invalidPassword');
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = i18n.t('signup.error.confirmPasswordRequired');
  } else if (
    values.confirmPassword &&
    values.confirmPassword !== values.password
  ) {
    errors.confirmPassword = i18n.t('signup.error.passwordsNotMatch');
  }

  return errors;
}
