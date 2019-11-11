import { Button, Container, Content, H2, Icon, Spinner, View } from 'native-base';
import React, { memo, useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { useRetryableObservable } from 'react-use-observable';
import { classes, variablesTheme } from '~/assets/theme';
import ErrorMessage from '~/components/Shared/ErrorMessage';
import { logError } from '~/helpers/rxjs-operators/logError';
import { IUseNavigation, useNavigation } from '~/hooks/useNavigation';
import orderService from '~/services/order';

const OrderScreen = memo((props: IUseNavigation) => {
  const navigation = useNavigation(props);

  const [order, error, , reload] = useRetryableObservable(() => {
    return orderService.get().pipe(logError());
  }, []);

  const navigateCreate = useCallback(() => navigation.navigate('OrderCreate'), [navigation]);

  useEffect(() => {
    navigation.setParam({ navigateCreate: null });
  }, [navigateCreate, navigation, order]);

  const loading = order === undefined && error === undefined;

  return (
    <Container>
      <NavigationEvents onWillFocus={reload} />

      <Content>
        {loading && <Spinner />}
        {!loading && !order && error && <ErrorMessage error={error} />}

        {!loading && order && (
          <View>
            <View style={styles.header}>
              <Icon active name='contact' style={styles.avatarIcon} />
              <H2 style={styles.headerText}>{`${order.description}`}</H2>
            </View>
          </View>
        )}
      </Content>
    </Container>
  );
});

OrderScreen.navigationOptions = ({ navigation }) => {
  return {
    title: 'Ordem',
    headerLeft: () => (
      <Button style={classes.headerButton} onPress={navigation.toggleDrawer}>
        <Icon name='menu' />
      </Button>
    ),
    headerRight: navigation.getParam('navigateCreate') && (
      <Button style={classes.headerButton} onPress={navigation.getParam('navigateCreate')}>
        <Icon name='create' />
      </Button>
    ),
    drawerIcon: ({ tintColor }) => <Icon name='contact' style={{ color: tintColor }} />
  };
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: variablesTheme.brandPrimary,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    color: 'white'
  },
  avatarIcon: {
    marginBottom: 10,
    color: 'white',
    fontSize: 100
  }
});

export default OrderScreen;
