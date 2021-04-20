import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

class SearchPickerCLKMItem extends React.PureComponent
{
    constructor(props)
    {
        super(props);

        this.state = {
            show: false
        };
    }

    toggleMore()
    {
        this.setState({
            show: !this.state.show
        });
    }

    render()
    {
        return (
            <View style={[styles.optionContainer, this.props.style]}>
                <Text style={styles.optionText}>{this.props.Name}</Text>

                {this.state.show ? <Text style={styles.descriptionText}>{this.props.Description}</Text> : null}

                <TouchableOpacity onPress={this.toggleMore.bind(this)}>
                    <Text style={styles.showMoreText}>{!this.state.show ? "Show more" : "Show less"}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


SearchPickerCLKMItem.defaultProps = {
    Name: "",
    Description: "",
    style: {}
};

export default SearchPickerCLKMItem;

const styles = StyleSheet.create({
    optionContainer: {
        //flexDirection: 'row'
        justifyContent: 'center', alignItems:'center', 
        borderWidth: 1,  borderColor: '#0b76ff', borderRadius: 5, 
        //marginHorizontal: 10, // marginVertical: 6, 
        marginBottom: 12,
    },
    optionText: {
        textAlign: 'center',
        paddingHorizontal: 10,
        color: '#0b76ff',
        fontSize: 16,
        marginVertical: 5,
        fontWeight: 'bold'
    },
    descriptionText: {
        textAlign: 'center',
        paddingHorizontal: 10,
        fontSize: 14,
        color: '#60a6ff',
        marginBottom: 5
    },
    showMoreText: {
        color: '#898989',
        fontSize: 12,
        marginBottom: 5
    },
});