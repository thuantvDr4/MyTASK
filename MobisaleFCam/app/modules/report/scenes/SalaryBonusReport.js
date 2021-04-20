import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    View, Image,TouchableOpacity, 
} from 'react-native';
import {strings} from 'locales/i18n';
import {connect} from 'react-redux';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import ButtonBack from '../../../libs/components/ButtonBack.js';
import RowInfo from 'app-libs/components/RowInfo';
import {actions} from '../';
import styles from '../styles'
const {reportTBonus} =  actions;
class SalaryBonusReport extends React.PureComponent {


    static navigationOptions = ({ navigation }) => {
        return {
            title:strings('report.typereportchoose.typereports.salarybonusreport.title'),
            // headerLeft: <ButtonBack navigation={navigation}/>,
            headerRight: <TouchableOpacity  style={{marginRight: 10}}/>
        };
    };


    constructor(props)
    {
        super(props);
        this.state ={
            data:null,
            isdataload:false,
            loadingVisible:true
        }

    }


    //Report bonus success
    onReportBonusSucess(dataSuccess){
        this._loading(false)
        this.setState({data:dataSuccess, isdataload:true})
    }


    //Report bonus error
    onReportBonusError(error){
        this._loading(false);
        if (!error.message) return;
        this.refs['popup'].getWrappedInstance().show(error.message.toString());
    }
    /**
    * Loading
    * @param isShow
    * @private
    */
    _loading(isShow){
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }
    
    //render data report salary bonus
    renderData(){
      if(this.state.data){
        return <ScrollView showsVerticalScrollIndicator={false}>
                 <View style={styles.styleContainerReportContent} >
                   {this.state.data.map((row, index) => (
                    <View style={styles.oneList}>
                        <View style={styles.infoBox}>
                        <RowInfo
                         label={strings('report.typereportchoose.typereports.salarybonusreport.list.list.contractnumber')}
                         text={row.Contract ? row.Contract : null}
                         />
                        <RowInfo
                         label={strings('report.typereportchoose.typereports.salarybonusreport.list.list.name')}
                         text={row.Name ? row.Name : null}
                         />
                         </View>
                    </View>
                ))
              }
                 </View>
               </ScrollView>
        }
        else
        {
        return(<View style ={styles.emptyview}>
                 <Image source={require('../../../assets/images/report/mdpireport.png')}/>
                 <Text style={styles.emptytext}>No reports yet</Text>
              </View>
           );
        }
    }


    componentDidMount(){
        const today = new Date();
        let data = {"Username":this.props.Username,"Month":today.getMonth()+1,"Year":today.getFullYear(),"Agent":"0","AgentName":"","PageNumber":"1"}
        this.props.reportTBonus(data,this.onReportBonusSucess.bind(this), this.onReportBonusError.bind(this))
    }


    render() {
        return (<View style={styles.container}>
               {
                this.state.isdataload? this.renderData():null
               }
                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}
export default connect(state => {
    return {
        Username: state.authReducer.Username
    }
},
{reportTBonus})(SalaryBonusReport)