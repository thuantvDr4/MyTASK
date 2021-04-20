import React from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import {strings} from 'locales/i18n';
import TechLoading from 'app-libs/components/TechLoading';


/*
*
* */
const CustomFlatList = ({data, isLoading, renderItem}) => {
    return (
        <View style={{flex: 1}}>
            {data && data.length !== 0 ?
                <FlatList
                    keyboardDismissMode={'on-drag'}
                    contentContainerStyle={{}}
                    data={data}
                    keyExtractor={(item, index) => 'key' + index}
                    renderItem={({item}) => renderItem(item)}
                />
                :
                <View style={styles.dataEmpty}>
                    <Image
                        resizeMode={'contain'}
                        style={[styles.imageNoData]}
                        source={require('../../assets/images/contract-list/report.png')}
                    />

                    <Text style={[styles.text_nonData]}>{strings('all.data.noData')}</Text>

                </View>

            }
            {/*..loading..*/}
            <TechLoading visible={isLoading}/>
        </View>
    )
}

/*
* StyleSheet
* */
const styles = StyleSheet.create({
    dataEmpty:{
        flex:1,
        alignItems:'center',
        paddingTop:50
    },
    wrapImage:{

    },
    imageNoData:{
        height: 100,
        width: 100,
    },
    text_nonData:{
        fontSize: 16,
        fontWeight: '500',
        color: '#D6D6D6',
        textAlign: 'center',
        marginTop: 26
    }

});

export default CustomFlatList;
