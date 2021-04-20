import React from 'react';
import {View, ScrollView, WebView,Platform} from 'react-native';
import {strings} from 'locales/i18n';

import TechLoading from 'app-libs/components/TechLoading';
import moduleStyle from '../styles';

import * as api from '../api';


/**
 * Man hinh hien thi hop dong mau
 * 
 * @author DaiDP
 * @since Aug, 2018
 */
class ContractPattern extends React.Component
{
    static navigationOptions = {
        title: strings('contract.contract_pattern.title'),
        headerRight: <View/>
    }

    constructor(props)
    {
        super(props);

        this.state = {
            params: this.props.navigation.state.params,
            loadingVisible: true,
            html: '',
            visible: true,
        }
        this.count = 0;
    }
    componentDidMount()
    {
        api.getHtmlContractPattern(this.state.params, this.loadHtmlSuccess.bind(this));
    }

    loadHtmlSuccess(isSucess, data, msg)
    {
        if (isSucess)
        {
            this.setState({
                html: data
            });
        }
    }

    showLoading(isShow)
    {
        this.setState({
            loadingVisible: isShow
        });
    }
    
    render()
    {
        return (
            <ScrollView contentContainerStyle={{flexGrow:1}}>
                <View style={moduleStyle.innerContainer}>
                    <WebView
                        source={{html: this.state.html}}
                        onNavigationStateChange={(e)=>{
                            if(Platform.OS === 'ios'){
                                if(e.loading === false && this.count == 1){
                                    this.setState({loadingVisible:false})
                                }
                                this.count = this.count+1;
                            }
                            else
                            {
                                if(e.loading === false && e.canGoBack){
                                    this.setState({loadingVisible:false})
                                }
                            }
                        }}
                        originWhitelist={['*']}
                    />
                </View>
                <TechLoading visible={this.state.loadingVisible}/>
            </ScrollView>
        );
    }
}

export default ContractPattern;