import { AppRegistry } from 'react-native';
import App from './App';
import './shim.js'
import crypto from 'crypto'
import { Base64 } from 'js-base64';

import { Client } from 'bugsnag-react-native';
// const bugsnag = new Client("b969fb18a5d0e5f0723f4b8ed4db63ca");

AppRegistry.registerComponent('MobisaleFCam', () => App);
