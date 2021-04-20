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
import {actions} from '../';
import styles from '../styles'
import RowInfo from 'app-libs/components/RowInfo';
const {reportTSub} =  actions;
class CancelServiceReport extends React.PureComponent {


    static navigationOptions = ({ navigation }) => {
        return {
            title:strings('report.typereportchoose.typereports.cancelservicereport.title'),
            // headerLeft: <ButtonBack navigation={navigation}/>,
            headerRight: <TouchableOpacity  style={{marginRight: 10}}/>
        };
    };


    constructor(props)
    {
        super(props);
        this.state ={
            dataType:0,
            data:null,
            isdataload:false,
            loadingVisible:false
        }

    }
    

    renderData(){
     if(this.state.data){
      return <ScrollView style={styles.styleContainerReportContent} >
                <View>
                   {this.state.data.map((row, index) => (
                    <View style={[styles.oneList,{height:220}]}>
                        <View style={[styles.infoBox,{height:220}]}>
                        <RowInfo
                        label={strings('report.typereportchoose.typereports.cancelservicereport.list.list.Status')}
                        text={row.Status ? row.Status : null}
                        />
                        <RowInfo
                        label={strings('report.typereportchoose.typereports.cancelservicereport.list.list.PaymentStatus')}
                        text={row.PaymenStatus ? row.PaymenStatus : null}
                        />
                        <RowInfo
                        label={strings('report.typereportchoose.typereports.cancelservicereport.list.list.contractnumber')}
                        text={row.Contract ? row.Contract : null}
                        />
                        <RowInfo
                        label={strings('report.typereportchoose.typereports.cancelservicereport.list.list.fullname')}
                        text={row.Name ? row.Name : null}
                        />
                        <RowInfo
                        label={strings('report.typereportchoose.typereports.cancelservicereport.list.list.date')}
                        text={row.Date ? row.Date : null}
                        />
                         <RowInfo
                        label={strings('report.typereportchoose.typereports.cancelservicereport.list.list.phone')}
                        text={row.Phone ? row.Phone : null}
                        />
                        <RowInfo
                        label={strings('report.typereportchoose.typereports.cancelservicereport.list.list.address')}
                        text={row.Address ? row.Address : null}
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
        return <View style ={styles.emptyview}>
             <Image source={require('../../../assets/images/report/mdpireport.png')}/>
             <Text style={styles.emptytext}>No reports yet</Text>
            </View>
        }
    }


    //Report cancel service success
    onReportCancelServiceSucess(dataSuccess){
        this._loading(false)
        this.setState({data:dataSuccess, isdataload:true})
    }

    //Report cancel service error
    onReportCancelServiceError(error){
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


     // handle choose type report TSub
    _handleChangeDataTypeReportTSub(value){
        this.setState({
            ...this.state,
            dataType : value,
            loadingVisible:true
        }, ()=>{
            this._handleLoadDataReportTSub();
        });
    }


    // handle connect api type report TSub
    _handleLoadDataReportTSub(){
        const today = new Date();
        let data = {"Username":this.props.Username,"Month":today.getMonth()+1,"Year":today.getFullYear(),"Agent":"0","AgentName":"","PageNumber":"1","type":this.state.dataType}
        this.props.reportTSub(data,this.onReportCancelServiceSucess.bind(this), this.onReportCancelServiceError.bind(this))
    }
   
    
    componentDidMount(){
          this._handleChangeDataTypeReportTSub(1);
    }

    
    render() {
        return (<View style={styles.container}>
                        <View style={styles.filterTypeBox}>
                            <View style={styles.row}>
                               <View style={styles.col}>
                                <TouchableOpacity
                                    style={[styles.btnFilterType, this.state.dataType == 1 ? styles.btnFilterActive:null]}
                                    onPress={() => {this._handleChangeDataTypeReportTSub(1)}}>
                                    <Text style={this.state.dataType == 1 ? styles.textFilterTypeActive : styles.textFilterType} >
                                        {strings('report.typereportchoose.typereports.cancelservicereport.list.filter_tab.tabt1')}
                                    </Text>
                                </TouchableOpacity>
                                </View>
                                <View style={styles.col}>
                                <TouchableOpacity
                                     style={[styles.btnFilterType, this.state.dataType == 2 ? styles.btnFilterActive:null]}
                                    onPress={() => {this._handleChangeDataTypeReportTSub(2)}}>
                                    <Text style={this.state.dataType == 2 ? styles.textFilterTypeActive : styles.textFilterType }>
                                        {strings('report.typereportchoose.typereports.cancelservicereport.list.filter_tab.tabt4')}
                                    </Text>
                                </TouchableOpacity>
                                </View>                      
                            </View>
                        </View>
                       {
                        this.state.isdataload ? this.renderData():null
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
{reportTSub})(CancelServiceReport)