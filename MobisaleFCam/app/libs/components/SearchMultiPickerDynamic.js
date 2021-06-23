import React from 'react';
import {View, FlatList, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, BackHandler} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {strings} from 'locales/i18n';
import TechLoading from 'app-libs/components/TechLoading';

/**
 * Search multiple select picker component
 *
 * use:
 * 		this.props.navigation.navigate('SearchMultiPickerDynamic', {
 * 			onChange: (selectedItemList) => {
 * 				// To do: Callback function when picker selected and go back this screen
 * 			},
 *          title: "Địa chỉ lắp đặt",
 *          placeholder: "Nhap ten tinh thanh",
 * 			getOptionData: (callback, isRefresh) => {
 *              // To do something
 *              callback(data);
 *          }
 *      })
 *
 * @author DaiDP
 * @since Aug, 2018
 */
class SearchMultiPickerDynamic extends React.PureComponent
{
    /**
     * Config navigation bar
     */
    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
            headerStyle: {
                backgroundColor: '#0B76FF',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
                alignSelf: 'center',
                width: '70%'
            },
            title: navigation.getParam('title', 'Config title here'),
        }
    };

    data = [];
    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props)
    {
        super(props);

        let selectedItemList = this.props.navigation.getParam('selectItem', []);
        for (index in selectedItemList) {
            selectedItemList[index].isSelected = true;
        }

        // init state
        this.state = {
            data: [], // full data from API
            dataSource: [], // Data display option
            text: '',
            selectedItems: selectedItemList,
            loadingVisible: true
        }

        // bind event
        this.onConfirm = this.onConfirm.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this._filterSearch = this._filterSearch.bind(this);
        this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);

        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );
    }

    componentDidMount()
    {
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        );

        this._loadData();
        this.props.navigation.setParams({loadData: this._loadData.bind(this)});
    }

    componentWillUnmount()
    {
        this._didFocusSubscription && this._didFocusSubscription.remove();
        this._willBlurSubscription && this._willBlurSubscription.remove();
    }

    onBackButtonPressAndroid()
    {
        setTimeout(() => this.props.navigation.goBack(), 100);
        return true;
    }

    _loadData(isRefresh)
    {
        const {getOptionData} = this.props.navigation.state.params;

        this.setState({
            loadingVisible: true
        });

        getOptionData((data) => {
            for (i in this.state.selectedItems) {
                index = data.findIndex(item => item.Id === this.state.selectedItems[i].Id);
                if (index >= 0) {
                    data[index].isSelected = true;
                }
            }

            this.setState({
                data: data,
                loadingVisible: false
            });

            this._filterSearch(this.state.text);
        }, isRefresh);
    }

    /**
     * Process filter data on list
     *
     * @param {*} text
     */
    _filterSearch(text) {
        const newData = this._getFilterData(text);

        this.setState({
            text: text,
            dataSource: newData
        });
    }

    _getFilterData(text)
    {
        return this.state.data.filter((item) => {
            const itemData = item.Name.toUpperCase();
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
    }

    onConfirm()
    {
        let selectedItemList = this.state.selectedItems;
        for (index in selectedItemList) {
            delete selectedItemList[index].isSelected;
        }

        this.props.navigation.goBack();
        this.props.navigation.state.params.onChange(selectedItemList);
    }

    /**
     * Callback when select item on list
     *
     * @param {*} selectItem
     */
    _onSelect(selectItem)
    {
        // Khoi tao data
        let listSelected = this.state.selectedItems || [];

        let isSelected   = true;
        let index        = listSelected.findIndex(item => item.Id === selectItem.Id);

        // Kiem tra action la chon hay bo chon
        if (index > -1) {
            listSelected.splice(index, 1);
            isSelected = false;
        }
        else {
            listSelected.push(selectItem);
        }

        // Danh dau trang thai cho dataSource
        let data = this.state.data;
        index = data.findIndex(item => item.Id === selectItem.Id);
        data[index].isSelected = isSelected;

        // Cap nhat list lai
        const newData = this._getFilterData(this.state.text);

        this.setState({
            selectedItems: listSelected,
            dataSource: newData,
            data: data
        });
    }

    /**
     * Render item of Flatview
     */
    _renderItem = ({item}) => {
        const isSelected = item.isSelected | false;

        if (isSelected)
        {
            return (
                <TouchableWithoutFeedback onPress={() => { this._onSelect(item) }}>
                    <View style={ [styles.optionContainer, styles.optionBorderSeleted] }>
                        <Text style={ [styles.optionText, styles.optionTextSeleted] }>{item.Name}</Text>
                        <Icon name="check" size={16} style={ [styles.optionIcon, styles.optionTextSeleted] }/>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        else
        {
            return (
                <TouchableOpacity onPress={() => { this._onSelect(item) }}>
                    <View style={styles.optionContainer}>
                        <Text style={styles.optionText}>{item.Name}</Text>
                        <Icon name="check" size={16} style={styles.optionIcon}/>
                    </View>
                </TouchableOpacity>
            );
        }

    }

    /**
     * Render view
     */
    render()
    {
        const placeholder = this.props.navigation.getParam('placeholder', '');

        return (
            <View style={{ flex:1 }}>
                <View style={styles.searchBar}>
                    <View style={styles.searchInput}>
                        <Icon name="search" size={16} style={styles.icon}/>
                        <TextInput
                            style={styles.input}
                            placeholder={placeholder}
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

                <View style={styles.confirmBar}>
                    <TouchableOpacity style={styles.button} onPress={this.onConfirm}>
                        <Text style={styles.buttonText}>{strings('dialog.confirm')}</Text>
                    </TouchableOpacity>
                </View>
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}


export default SearchMultiPickerDynamic;

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: '#0B76FF',
        minHeight: 60,
        maxHeight: 60,
        height: 60,
        flex: 0.01
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginHorizontal: 32,
        marginBottom: 16,
        minHeight: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10
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
        paddingTop: 10,
        paddingBottom: 5,
        flex: 1
    },
    optionContainer: {
        borderWidth: 1,
        borderColor: '#9ec9ff',
        marginHorizontal: 24,
        marginVertical: 6,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems:'center',
        flexDirection: 'row'
    },
    optionText: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        color: '#9ec9ff',
        fontSize: 14,
        lineHeight: 48
    },
    optionIcon: {
        position: 'absolute',
        right: 15,
        color: '#9ec9ff',
    },
    optionBorderSeleted: {
        borderColor: '#0b76ff',
    },
    optionTextSeleted: {
        color: '#0b76ff',
    },

    confirmBar: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(154,154,154,0.4)'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B76FF',
        height: 48,
        borderRadius: 5,
        zIndex: 100,
        marginHorizontal: 25,
        marginBottom: 24, marginTop: 10,
        shadowColor: '#9EC9FF',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.75,
        shadowRadius: 7,
        elevation: 10,
    },
    buttonText: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 20,
    }
});
