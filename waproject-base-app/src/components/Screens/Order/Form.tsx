import FieldText from '@react-form-fields/native-base/Text';
import ValidationContext, { IValidationContextRef } from '@react-form-fields/native-base/ValidationContext';
import { Button, Container, Content, Form, Icon, List } from 'native-base';
import React, { memo, useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';
import { useCallbackObservable } from 'react-use-observable';
import { of, timer } from 'rxjs';
import { filter, first, switchMap, tap } from 'rxjs/operators';
import { classes } from '~/assets/theme';
import Toast from '~/facades/toast';
import { loader } from '~/helpers/rxjs-operators/loader';
import { logError } from '~/helpers/rxjs-operators/logError';
import useModel from '~/hooks/useModel';
import { IUseNavigation, useNavigation } from '~/hooks/useNavigation';
import { IOrder } from '~/interfaces/models/order';
import orderService from '~/services/order';

const OrderScreen = memo((props: IUseNavigation) => {
  const navigation = useNavigation(props);
  const validationRef = useRef<IValidationContextRef>();

  const [model, setModelProp] = useModel<IOrder>();

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
  }, [model, navigation]);

  useEffect(() => {
    navigation.setParam({ onSave });
  }, [navigation, onSave]);

  return (
    <Container>
      <Content padder keyboardShouldPersistTaps='handled'>
        <Form>
          <ValidationContext ref={validationRef}>
            <List>
              <FieldText
                label='Nome'
                validation='string|required|min:5|max:200'
                value={model.description}
                flowIndex={1}
                onChange={setModelProp('description', (value, model) => (model.description = value))}
              />

              <FieldText
                label='Quantidade'
                keyboardType='number-pad'
                validation='required'
                value={model.amount}
                flowIndex={2}
                onChange={setModelProp('amount', (value, model) => (model.amount = value))}
              />

              <FieldText
                label='Valor'
                keyboardType='number-pad'
                validation='required'
                value={model.value}
                flowIndex={3}
                onChange={setModelProp('value', (value, model) => (model.value = value))}
              />
            </List>
          </ValidationContext>
        </Form>
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
    headerRight: navigation.getParam('onSave') && (
      <Button style={classes.headerButton} onPress={navigation.getParam('onSave')}>
        <Icon name='save' />
      </Button>
    ),
    drawerIcon: ({ tintColor }) => <Icon name='menu' style={{ color: tintColor }} />
  };
};

export default OrderScreen;
