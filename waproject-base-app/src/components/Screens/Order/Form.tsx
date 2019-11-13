import FieldText from '@react-form-fields/native-base/Text';
import ValidationContext, { IValidationContextRef } from '@react-form-fields/native-base/ValidationContext';
import { Button, Card, Content, Form, Icon, Text, View } from 'native-base';
import React, { memo, useCallback, useRef } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import { useCallbackObservable } from 'react-use-observable';
import { of, timer } from 'rxjs';
import { filter, first, switchMap, tap } from 'rxjs/operators';
import { classes, variablesTheme } from '~/assets/theme';
import Toast from '~/facades/toast';
import { loader } from '~/helpers/rxjs-operators/loader';
import { logError } from '~/helpers/rxjs-operators/logError';
import useModel from '~/hooks/useModel';
import { IUseNavigation, useNavigation } from '~/hooks/useNavigation';
import { IOrder } from '~/interfaces/models/order';
import orderService from '~/services/order';

const OrderScreen = memo((props: IUseNavigation) => {
  const [model, setModelProp] = useModel<IOrder>({});

  const navigation = useNavigation(props);
  const validationRef = useRef<IValidationContextRef>();

  const onClompleteSave = useCallback(() => navigation.navigate('Home', null, true), [navigation]);

  const [onSave] = useCallbackObservable(() => {
    return of(true).pipe(
      tap(() => Keyboard.dismiss()),
      switchMap(() => timer(500)),
      first(),
      switchMap(() => validationRef.current.isValid()),
      tap(valid => !valid && Toast.showError('Revise os campos')),
      filter(valid => valid),
      switchMap(() => orderService.save(model as IOrder).pipe(loader())),
      logError(),
      tap(() => navigation.back(), err => Toast.showError(err))
    );
  }, [model, navigation, onClompleteSave]);

  return (
    <View style={styles.container}>
      <Content padder keyboardShouldPersistTaps='handled'>
        <Form>
          <ValidationContext ref={validationRef}>
            <Card style={styles.formContainer}>
              <FieldText
                leftIcon='clipboard'
                placeholder='Descrição'
                validation='string|required|min:5|max:200'
                value={model.description}
                flowIndex={1}
                marginBottom
                hideErrorMessage
                onChange={setModelProp('description', (model, value) => (model.description = value))}
              />

              <FieldText
                leftIcon='cart'
                placeholder='Quantidade'
                keyboardType='number-pad'
                validation='required'
                value={model.amount}
                flowIndex={2}
                marginBottom
                hideErrorMessage
                onChange={setModelProp('amount', (model, value) => (model.amount = value))}
              />

              <FieldText
                leftIcon='cash'
                placeholder='Valor'
                keyboardType='number-pad'
                validation='required'
                value={model.value}
                flowIndex={3}
                marginBottom
                hideErrorMessage
                onChange={setModelProp('value', (model, value) => (model.value = value))}
                onSubmitEditing={onSave}
              />
            </Card>

            <View style={styles.registerContainer}>
              <Button onPress={onSave} success block style={styles.buttons}>
                <Text>Salvar</Text>
              </Button>
            </View>
          </ValidationContext>
        </Form>
      </Content>
    </View>
  );
});

OrderScreen.navigationOptions = ({ navigation }) => {
  return {
    title: 'Ordem',
    headerLeft: () => (
      <Button style={classes.headerButton} onPress={navigation.openDrawer}>
        <Icon name='menu' />
      </Button>
    ),
    headerRight: navigation.getParam('onSave') && (
      <Button style={classes.headerButton} onPress={navigation.getParam('onSave')}>
        <Icon name='save' />
      </Button>
    ),
    drawerIcon: ({ tintColor }) => <Icon name='menu' style={{ color: tintColor }} />
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  buttons: {
    marginTop: 16
  },
  formContainer: {
    padding: 20,
    width: variablesTheme.deviceWidth * 0.8,
    flexShrink: 0
  },
  registerContainer: {
    flex: 1,
    flexGrow: 0,
    flexShrink: 0
  }
});

export default OrderScreen;
