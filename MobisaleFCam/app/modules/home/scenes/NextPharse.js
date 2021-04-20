import React from 'react';
import {
    View,
    Alert
} from 'react-native';

import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import {HeaderBackButton} from 'react-navigation';
import NavigationService from 'app-libs/helpers/NavigationService';
import styles from '../styles';

class NextPharse extends React.PureComponent {

    static navigationOptions = ({ navigation }) => {
        return {
            //title: 'Deploy',
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>
        };
    };

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.navigation.addListener('willFocus', () => {
            Alert.alert(
                strings('dialog.title'),
                strings('dl.home.next_phase'),
                [
                    {
                        text: strings('dialog.agree'),
                        onPress: () => NavigationService.navigate('TabHome')
                    },
                ],
                { cancelable: false }
            )
        });
    }

    render(){
        return(
            <View style={{...styles.container, flex:1,backgroundColor:"#FFF"}}>
            </View>
        )
    }
}
export default connect()(NextPharse)