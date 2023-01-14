import { showMessage } from 'react-native-flash-message';

const showError = (message: string) => {
  showMessage({
    message,
    type: 'danger',
    icon: 'danger',
  });
};

export { showError };
