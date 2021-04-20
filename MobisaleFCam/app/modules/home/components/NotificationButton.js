import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {strings} from 'locales/i18n';
import styles from '../styles';

/**
 * NotificationButton Component
 * 
 * 
 * ############# Properties #############
 * 1. options: Array of options
 * 
 * ############# Events #################
 * 1. onValueChange(value): Event when select change
 * 
 * @author ThuanDD3
 * @since Aug, 2019
 */
class NotificationButton extends React.PureComponent {
    /**
     * 
     */
    constructor(props) {
        super(props);

        this.state = {
            numberUnRead: this.props.numberUnRead
        };
    }

    /**
     * 
     */
    componentWillReceiveProps(nextProps) {
        let newState = {};
        
        if (nextProps.numberUnRead != this.props.numberUnRead) {
            newState.numberUnRead = nextProps.numberUnRead;
        }

        if (nextProps.onPress != this.props.onPress) {
            newState.onPress = nextProps.onPress;
        }

        this.setState(newState);
    }

    /**
     * 
     */
    _onPress() {
        this.props.onPress && this.props.onPress();
    }

    render() {
        const numberUnRead = this.state.numberUnRead;

        return (
            <View style={[styles.notiBlock]}>
                
                <TouchableOpacity 
                    style={[styles.notiButton]} 
                    onPress={this._onPress.bind(this)} > 
                    { numberUnRead !== 0 
                        ?
                        <View style={[styles.notiDot]}>
                            <Text style={[styles.notiText]}>{numberUnRead > 9 ? "9+" : numberUnRead }</Text>
                        </View>
                        : 
                        null
                    }
                    <Image 
                        style={[styles.notiIcon, numberUnRead === 0 ? {opacity: 0.5} : null ]} 
                        source={require('../../../assets/images/home/clear-all.png')} />
                
                </TouchableOpacity>
            </View>
        );
    }
}

NotificationButton.defaultProps = {
    numberUnRead: 0,
    onPress: () => {}
}

export default NotificationButton;

