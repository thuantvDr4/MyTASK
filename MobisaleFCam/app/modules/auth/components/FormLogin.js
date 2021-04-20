import React, {Component} from 'react';
import Dimensions from 'Dimensions';
import { StyleSheet,KeyboardAvoidingView, Keyboard } from 'react-native';
import { CheckBox } from 'react-native-elements'

import {strings} from 'locales/i18n';

import UserInput from './UserInput';
import ButtonSubmit from './ButtonSubmit';

import usernameImg from 'assets/images/auth/ic24_User.png';
import passwordImg from 'assets/images/auth/ic24_Password.png';

export default class FormLogin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showPass: true,
            press: false,
            data: {
                // live
                Username: this.props.Username,
                Password: '',

                // staging test S8
                // Username: 'PP.Neth Sreylin',
                // staging test Ip7
                // Username: 'PP.Norng Makara',
                
                // production test S8
                // Username: 'PP.ISC_ThuanDD3',
                // Password: '123456',
                Checked: this.props.rememberPass,
            }
        };

        this.showPass = this.showPass.bind(this);
    }

    showPass() {
        this.state.press === false
            ? this.setState({showPass: false, press: true})
            : this.setState({showPass: true, press: false});
    }

    _onChange(key, text) {
        let state = this.state;
        state.data[key] = text;
        this.setState(state);
    }

    _onSubmit() {
        Keyboard.dismiss();
        const data  = this.state.data;
        let isValid = true;

        if (data.Username.trim().length === 0) {
            this.props.PopupWarning(strings('dl.auth.validate.username_required'));
            return;
        }

        if (data.Password.length === 0) {
            this.props.PopupWarning(strings('dl.auth.validate.password_required'));
            return;
        }

        if (data.Password.length < 6) {
            this.props.PopupWarning(strings('dl.auth.validate.passsword_min_length'));
            return;
        }

        this.props.onSubmit(data);
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container} enabled>
                <UserInput
                    source={usernameImg}
                    placeholder='Username'
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    onChangeText={ (text) => this._onChange('Username', text) }
                    value={this.state.data['Username']}
                />

                <UserInput
                    source={passwordImg}
                    secureTextEntry={this.state.showPass}
                    placeholder='Password'
                    returnKeyType={'done'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={ (text) => this._onChange('Password', text) }
                    value={this.state.data['Password']}
                />

                <CheckBox
                    title='Remember Me' 
                    size={20} 
                    textStyle={!this.state.data.Checked ? {color: '#C2D0E2'} : null}
                    containerStyle={{backgroundColor: 'transparent', borderWidth: 0, paddingLeft: 26, margin: 0}}
                    uncheckedColor={'#C2D0E2'}
                
                    checked={this.state.data.Checked}
                    onPress={() => this.setState({...this.state, data: { ...this.state.data, Checked: !this.state.data.Checked }})}
                />

                <ButtonSubmit
                    onSubmit={ () => this._onSubmit() }
                />
            </KeyboardAvoidingView>
        );
    }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        // maxHeight: 212,
        // minHeight: 212,
        // paddingTop: 20,
        maxHeight: 230,
        //minHeight: 247,
        //paddingTop:55
        // backgroundColor: 'blue'
    },
    btnEye: {
        position: 'absolute',
        top: 55,
        right: 28,
    },
    iconEye: {
        width: 25,
        height: 25,
        tintColor: 'rgba(0,0,0,0.2)',
    },
});