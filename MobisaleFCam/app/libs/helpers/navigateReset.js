import {NavigationActions, StackActions} from 'react-navigation';

export default function navigateReset(routeName)
{
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: routeName })],
    });
    this.props.navigation.dispatch(resetAction);
}