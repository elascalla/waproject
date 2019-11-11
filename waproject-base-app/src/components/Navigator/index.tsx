import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { variablesTheme } from '~/assets/theme';
import IndexPage from '~/components/Screens';
import DevPage from '~/components/Screens/_Dev';
import LoginPage from '~/components/Screens/Login';
import OrderCreatePage from '~/components/Screens/Order/Form';
import UserEditPage from '~/components/Screens/Profile/Form';
import getNavigationOptions from '~/helpers/getNavigationOptions';

import HomeDrawerNavigator, { HomeDrawerScreens } from './HomeDrawer';

// import HomeTabNavigator, { HomeTabScreens } from './HomeTab';
const Navigator = createStackNavigator(
  {
    Index: { screen: IndexPage },
    Login: { screen: LoginPage },

    Home: {
      screen: HomeDrawerNavigator,
      navigationOptions: getNavigationOptions(HomeDrawerScreens)
    },

    UserEdit: { screen: UserEditPage },
    OrderCreate: { screen: OrderCreatePage },
    Dev: { screen: DevPage }
  },
  {
    // headerMode: 'none',
    headerBackTitleVisible: false,
    initialRouteName: 'Index',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: variablesTheme.toolbarDefaultBg
      },
      headerTintColor: variablesTheme.toolbarBtnTextColor
    }
  }
);

export default createAppContainer(Navigator);
