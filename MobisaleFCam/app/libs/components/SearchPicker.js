import React from 'react';
import {View, FlatList, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

/**
 * Search picker
 * 
 * use: 
 * 		this.props.navigation.navigate('SearchPicker', {
 * 			onChange: (selectedItem) => {
 * 				// To do: Callback function when picker selected and go back this screen
 * 			}, 
 *          title: "Địa chỉ lắp đặt",
 *          placeholder: "Nhap ten tinh thanh",
 * 			dataSource: [
 * 				{"Id": 123, "Name": "Ten abc"}
 * 			] 
 *      })
 * 
 * @author DaiDP
 * @since Aug, 2018
 */
class SearchPicker extends React.Component 
{
	/**
	 * Config navigation bar
	 */
    static navigationOptions = ({navigation, navigationOptions}) => {
		return {
			...navigationOptions,
			headerStyle: {
				...navigationOptions.headerStyle,
				elevation: 0
			},
			headerTitleStyle: {
				...navigationOptions.headerTitleStyle,
				width: '70%'
			},
			title: navigation.getParam('title', 'Config title here')
		}
    };

	data = [];

    constructor(props)
    {
		super(props);

		// Get data fetch to list
		data = this.props.navigation.getParam('dataSource', []);
		
		// init state
        this.state = {
            dataSource: data,
            text: ''
        }

		// bind event
        this._onChange = this._onChange.bind(this);
		this.filterSearch = this.filterSearch.bind(this);
    }

	/**
	 * Process filter data on list
	 * 
	 * @param {*} text 
	 */
    filterSearch(text) {
        const newData = data.filter((item) => {
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
                            onChangeText={(text) => this.filterSearch(text)}
                            underlineColorAndroid='rgba(0,0,0,0)'
                        />
                    </View>
                </View>
                
                <View style={styles.optionWraper}>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={this._renderItem}
                />
                </View>
                
            </View>
        );
    }
}


export default SearchPicker;

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
        lineHeight: 48
    },
});