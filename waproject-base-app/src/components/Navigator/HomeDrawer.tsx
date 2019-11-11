import { createDrawerNavigator } from 'react-navigation-drawer';
import { variablesTheme } from '~/assets/theme';
import HomePage from '~/components/Screens/Home';
import OrderPage from '~/components/Screens/Order/Details';
import ProfilePage from '~/components/Screens/Profile/Details';

import Drawer from '../Shared/Drawer';

export const HomeDrawerScreens: any = {
  Home: { screen: HomePage },
  Profile: { screen: ProfilePage },
  Order: { screen: OrderPage }
};

const HomeDrawerNavigator = createDrawerNavigator(HomeDrawerScreens, {
  initialRouteName: 'Home',
  contentComponent: Drawer as any,
  contentOptions: {
    activeTintColor: variablesTheme.brandPrimary
  }
});

export default HomeDrawerNavigator;
