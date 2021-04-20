import {StyleSheet} from 'react-native';

export default function createValidStyleSheet(isValid)
{
    if (isValid) {
        return {
            validStyleBorder: {},
            validStyleText: {}
        };
    }

    return StyleSheet.create({
        validStyleBorder: {
            borderColor: '#ff5050'
        },
        validStyleText: {
            color: '#ff5050'
        }
    });
}