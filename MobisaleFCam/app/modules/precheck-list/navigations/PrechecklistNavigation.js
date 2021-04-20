/*
    Main Module: Prechecklist Navigation
    Sub: Navigation
    Author: Thuandd3
    Date Create: 13/03/19
*/

// Lib
import {createStackNavigator} from 'react-navigation';

// Component
import Prechecklist from '../scenes/Prechecklist';
import PrechecklistDetails from '../scenes/PrechecklistDetails';
import Filter from '../components/Filter';

export default {
    
    Prechecklist: {
        screen: Prechecklist
    },
    PrechecklistDetails: {
        screen: PrechecklistDetails
    },
    FilterPrechecklist: {
        screen: Filter
    }
    
};
