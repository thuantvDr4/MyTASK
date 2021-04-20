import React from 'react';
import {View, WebView, StyleSheet, Text,TouchableOpacity, Platform} from 'react-native';
import {strings} from 'locales/i18n';
import {connect} from 'react-redux';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import ButtonBack from '../../../libs/components/ButtonBack.js';
import {actions} from '../';
const {reportSalary} =  actions;

/*@author tuantt14
 * @since March, 2019
 */
class SalaryReport extends React.PureComponent {


    static navigationOptions = ({ navigation }) => {
        return {
            title:strings('report.typereportchoose.typereports.salaryreport.title'),
            // headerLeft: <ButtonBack navigation={navigation}/>,
            headerRight:<TouchableOpacity  style={{marginRight: 10}}/>
        };
    };


    // constructor 
    constructor(props)
    {
        super(props);

        this.state = {
            loadingVisible: true,
            isdataload:false,
            html:null
        }
        this.count = 0;
    }
    

    //Render view  html data salary
    renderData()
    {     
        if(this.state.html)
          {
            if(Platform.OS === 'ios')
               {
                return<WebView 
                source={{html: this.state.html}}
                scalesPageToFit={false}
                onNavigationStateChange={(e)=>{
                    if(e.loading === false ){
                        this._loading(false)
                    }
                }}
                originWhitelist={['*']}/>
            }
            else
            {
                return<WebView
                source={{html: this.state.html}}
                onLoad ={()=>{ this._loading(false)}}
                originWhitelist={['*']}/>
            }
           }
          else
          {
               return <View style={styles.emptydata}><Text style={styles.emptydatatextstyle}>BẢNG LƯƠNG</Text></View>
          }
    }


    /*Report salary success
    * @param dataSuccess
    */
    onReportSalarySucess(dataSuccess)
    {
        this.setState({html:dataSuccess[0].Html,isdataload:true})
    }


    /*Report salary error
    * @param error
    */
    onReportSalaryError(error){
        this._loading(false);
        if (!error.message) return;
        this.refs['popup'].getWrappedInstance().show(error.message.toString());
    }


    /*
     * Loading
     * @param isShow
     * @private
     */
    _loading(isShow)
    {
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }


    // init connect api get report data html for salary
    componentDidMount(){
        const today = new Date();
        let data = {"Username":this.props.Username,"Month":today.getMonth()+1,"Year":today.getFullYear(),"Agent":"0","AgentName":"","PageNumber":"1"}
        this.props.reportSalary(data,this.onReportSalarySucess.bind(this), this.onReportSalaryError.bind(this))
    }
    

    //render page
    render(){
        return (
                <View style={{flex:1}}>
                 {this.state.isdataload ? this.renderData():null}
                 <PopupWarning ref="popup"/>
                 <TechLoading visible={this.state.loadingVisible}/>
                </View>
        );
    }
}


export default connect(
    state => {
        return {
            Username: state.authReducer.Username
        }
    },
    {reportSalary}
)(SalaryReport)


const styles = StyleSheet.create({
    emptydata:{
        flex:1, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptydatatextstyle:{
        fontSize:20, 
        color:'gray'
    }
});