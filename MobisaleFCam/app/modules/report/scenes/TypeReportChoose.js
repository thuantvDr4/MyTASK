import React, {Component} from 'react';
import {
    View, FlatList, Text, StyleSheet, TextInput, TouchableOpacity, Image
} from 'react-native';
import {strings} from 'locales/i18n';
import {HeaderBackButton} from 'react-navigation';
import {connect} from 'react-redux';
import NavigationService from 'app-libs/helpers/NavigationService';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import * as api from '../api';
import Icon from 'react-native-vector-icons/FontAwesome';
import ButtonBack from '../../../libs/components/ButtonBack.js';

class TypeReportChoose extends React.PureComponent {

    static navigationOptions = ({navigation}) => {
        return {
            title: strings('report.typereportchoose.title'),
            // headerLeft: <ButtonBack navigation={navigation}/>,
            headerRight: <TouchableOpacity style={{marginRight: 10}}/>
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    Id: 0,
                    Name: strings('report.filter.title')
                },
                {
                    Id: 1,
                    Name: strings('report.extraService.title')
                },
                {
                    Id: 2,
                    Name: strings('report.open_safe.title')
                },
                {
                    Id: 3,
                    Name: strings('report.typereportchoose.typereports.salaryreport.title')
                },
                {
                    Id: 4,
                    Name: strings('report.typereportchoose.typereports.cancelservicereport.title')
                },
                {
                    Id: 5,
                    Name: strings('report.typereportchoose.typereports.salarybonusreport.title')
                }
            ],

            dataSource: [
                {
                    Id: 0,
                    Name: strings('report.filter.title'),
                    RouteName: 'hideTabBottomReportFilter',
                },
                {
                    Id: 1,
                    Name: strings('report.extraService.title'),
                    RouteName: 'hideTabBottomExtraServiceReport',
                },
                {
                    Id: 2,
                    Name: strings('report.open_safe.title'),
                    RouteName: 'hideTabBottomOpenSafeFilter',
                },
                {
                    Id: 3,
                    Name: strings('report.typereportchoose.typereports.salaryreport.title'),
                    RouteName: 'hideTabBottomSalaryReport',
                },
                {
                    Id: 4,
                    Name: strings('report.typereportchoose.typereports.cancelservicereport.title'),
                    RouteName: 'hideTabBottomCancelServiceReport',
                },
                {
                    Id: 5,
                    Name: strings('report.typereportchoose.typereports.salarybonusreport.title'),
                    RouteName: 'hideTabBottomSalaryBonusReport',
                }],

            text: ''
        }
        // các màn hình chuyển
        this.itemsNavigation = ['hideTabBottomReportFilter', 'hideTabBottomExtraServiceReport', 'hideTabBottomSalaryReport', 'hideTabBottomCancelServiceReport', 'hideTabBottomSalaryBonusReport']
    }

    componentDidMount() {
    }

    /**
     * Process filter data on list
     *
     * @param {*} text
     */
    _filterSearch(text) {
        const newData = this.state.data.filter((item) => {
            const itemData = item.Name.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });

        this.setState({
            text: text,
            dataSource: newData
        });
    }


    /*
    * itemOnPress
    * */
    _itemOnPress =(routeName)=>{
        if(!routeName){
           return;
        }
        NavigationService.navigate(routeName)
    }



    /**
     * Render item of Flatview
     */
    _renderItem = ({item, index}) => (
        <TouchableOpacity style={styles.typereport} onPress={() =>this._itemOnPress(item.RouteName)}>
            <View style={styles.optionContainer}>
                <Text style={styles.optionText}>{item.Name}</Text>
            </View>
        </TouchableOpacity>
    );

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={styles.searchBar}>
                    <View style={styles.searchInput}>
                        <Icon name="search" size={16} style={styles.icon}/>
                        <TextInput
                            style={styles.input}
                            placeholder={strings('report.typereportchoose.placeholder')}
                            value={this.state.text}
                            onChangeText={(text) => this._filterSearch(text)}
                            underlineColorAndroid='rgba(0,0,0,0)'
                        />
                    </View>
                </View>

                <View style={styles.optionWraper}>
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index + "_" + item.Id}
                    />
                </View>
            </View>
        );
    }
}

export default connect()(TypeReportChoose)

const styles = StyleSheet.create({
    typereport: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchBar: {
        backgroundColor: '#0B76FF',
        minHeight: 60, maxHeight: 60, height: 60,
        flex: 0.01
    },
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginHorizontal: 32,
        marginBottom: 16,
    },
    icon: {
        marginHorizontal: 12
    },
    input: {
        flex: 1,
        minHeight: 40,
        height: 40
    },
    optionWraper: {
        flex: 1,
        paddingTop: 24,
        paddingHorizontal: 24,
        backgroundColor: '#F6F7FA'
    },
    optionContainer: {
        width: '100%',
        height: 48,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#0b76ff',
        borderRadius: 6,
        backgroundColor: '#fff'
    },
    optionText: {
        color: '#0b76ff',
        fontSize: 14
    },
});
