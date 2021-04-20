import React from 'react';
import {View, FlatList, Text, StyleSheet, TextInput, TouchableOpacity, BackHandler} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TechLoading from 'app-libs/components/TechLoading';


/**
 * Search multiple select picker component
 * 
 * use: 
 * 		this.props.navigation.navigate('SearchPickerDynamic', {
 * 			onChange: (selectedItemList) => {
 * 				// To do: Callback function when picker selected and go back this screen
 * 			}, 
 *          title: "Địa chỉ lắp đặt",
 *          placeholder: "Nhap ten tinh thanh",
 *          allowRefresh: {true} // An hien nut refresh cache
 * 			getOptionData: (callback, isRefresh) => {
 *              // To do something
 *              callback(data);
 *          }
 *      })
 * 
 * @author DaiDP
 * @since Aug, 2018
 */
class SearchPickerDynamic extends React.Component 
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
                width: navigation.getParam('allowRefresh') ? '90%' : '70%'
            },
            title: navigation.getParam('title', 'Config title here'),
            headerRight: (
                navigation.getParam('allowRefresh') ?
                    <TouchableOpacity onPress={() => navigation.getParam('loadData')(1)} style={{marginRight: 10}}>
                        <Icon name="refresh" size={24} style={{color: '#fff'}}/>
                    </TouchableOpacity>
                : null
            )
		}
    };

    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props)
    {
		super(props);
		
		// init state
        this.state = {
            data: [], // full data from API
            dataSource: [], // Data display option
            text: '',
            loadingVisible: true,
        }

		// bind event
        this._onChange = this._onChange.bind(this);
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

	/**
	 * Callback when select item on list
	 * 
	 * @param {*} selectItem 
	 */
    _onChange(selectItem)
    {
        this.props.navigation.goBack();
        this.props.navigation.state.params.onChange(selectItem);
    }

	/**
	 * Render item of Flatview
	 */
    _renderItem = ({item}) => (
        <TouchableOpacity onPress={() => { this._onChange(item) }}>
            <View style={styles.optionContainer}>
                <Text style={styles.optionText}>{item.Name}</Text>
            </View>
        </TouchableOpacity>
    );

	/**
	 * Render view
	 */
    render()
    {
		const placeholder = this.props.navigation.getParam('placeholder', '');

        return (
            <View style={{ flex:1}}>
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
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}


export default SearchPickerDynamic;

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
        marginHorizontal: 24,
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
        borderColor: '#0b76ff', 
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
        color: '#0b76ff',
        fontSize: 14,
        marginVertical: 16,
        //lineHeight: 48
        lineHeight: 18
    },
});