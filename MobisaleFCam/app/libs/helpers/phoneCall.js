/**
 * - Make a phone call
 * @author ThuanDD3
 * @date Jul, 2019
 */

//  LIB
import { Platform, Linking } from 'react-native'

// CONSTANT
const isString = (str) => Object.prototype.toString.call(str) === '[object String]'
const isBool = (bool) => Object.prototype.toString.call(bool) === '[object Boolean]'

// const createError = (msg = '') => Promise.reject(new Error(msg))
const createError = (msg = '') => Promise.reject(msg);

const openLink = (url, cb) => {
    return Linking.canOpenURL(url).then(canOpen => {
        if (!canOpen) {
            return createError(`Invalid URL provided: ${url}`);
        } else {
            return Linking.openURL(url)
            .then(() => {
                cb(true);
            })
            .catch((err) => Promise.reject(err));
        }
    })
}

const call = (args = {}, callback) => {

    const settings = Object.assign({
        prompt: true
    }, args)

    if (!settings.number) { return createError('No number provided') }
    if (!isString(settings.number)) { return createError('Number should be string') }
    if (!isBool(settings.prompt)) { return createError('Prompt should be bool') }

    const url = `${Platform.OS === 'ios' && settings.prompt ? 'telprompt:' : 'tel:'}${settings.number}`;

    return openLink(url, (success) => {
        callback(success);
    })
}

export default call