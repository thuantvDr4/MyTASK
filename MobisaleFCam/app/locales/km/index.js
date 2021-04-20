import auth from './auth.json';
import dialog from './dialog.json';

// V2
import deployment from './deployment.json';

export default km = {
    ...auth,
    ...dialog,
    ...deployment
};