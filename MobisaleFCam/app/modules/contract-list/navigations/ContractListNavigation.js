/*
    Module: Contract List Navigation
    Author: Thuandd3
    Date Create: 13/03/19
*/

// Lib
import { createStackNavigator } from 'react-navigation';

// Component
import ContractList from '../scenes/ContractList';
import CreatePrechecklist from '../scenes/CreatePrechecklist';
import CreateDivision from '../scenes/CreateDivision';
import DivisionLists from '../scenes/DivisionLists';
import DivisionDetail from '../scenes/DivisionDetail';
import BillHistory from '../scenes/BillHistory';
import ChangeStatusHistory from '../scenes/ChangeStatusHistory';

export default {
    ContractList: { screen: ContractList },
    CreatePrechecklist: { screen: CreatePrechecklist },
    CreateDivision: { screen: CreateDivision },
    DivisionLists: { screen: DivisionLists },
    DivisionDetail: { screen: DivisionDetail },
    BillHistory: { screen: BillHistory },
    ChangeStatusHistory: { screen: ChangeStatusHistory },
};
