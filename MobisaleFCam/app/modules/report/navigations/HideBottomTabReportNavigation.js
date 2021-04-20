import ReportFilter from '../scenes/ReportFilter';
import ReportList from '../scenes/ReportList';
import TypeReportChoose from '../scenes/TypeReportChoose';
import SalaryReport from '../scenes/SalaryReport';
import CancelServiceReport from '../scenes/CancelServiceReport';
import SalaryBonusReport from '../scenes/SalaryBonusReport';
//V2.8- thuantv-add-06/10/2020
import ExtraServiceReport from '../scenes/ExtraServiceReport';
import ExtraServiceReportList from "../scenes/ExtraServiceReportList";


export default {
    hideTabBottomTypeReportChoose: {
        screen: TypeReportChoose,
    },
    //V2.8
    hideTabBottomExtraServiceReport: {
        screen: ExtraServiceReport,
    },
    //V2.8
    hideTabBottomExtraServiceReportList: {
        screen: ExtraServiceReportList,
    },

    hideTabBottomReportFilter: {
        screen: ReportFilter
    },
    hideTabBottomSalaryReport: {
        screen: SalaryReport
    },
    hideTabBottomReportList: {
        screen: ReportList
    },
    hideTabBottomCancelServiceReport: {
        screen: CancelServiceReport
    },
    hideTabBottomSalaryBonusReport:{
        screen: SalaryBonusReport
	}
}
