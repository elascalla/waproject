import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormValidation from '@react-form-fields/material-ui/components/FormValidation';
import FieldText from '@react-form-fields/material-ui/components/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import useModel from 'hooks/useModel';
import IOrder from 'interfaces/models/order';
import React, { Fragment, memo, useCallback, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { of } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import orderService from 'services/order';

interface IProps {
  opened: boolean;
  order?: IOrder;
  onComplete: (order: IOrder) => void;
  onCancel: () => void;
}

const useStyle = makeStyles({
  content: {
    width: 400,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

const OrderFormDialog = memo((props: IProps) => {
  const classes = useStyle(props);

  const [model, setModelProp, setModel, , clearModel] = useModel<IOrder>();
  const [loading, setLoading] = useState<boolean>(true);

  const handleEnter = useCallback(() => {
    setModel(props.order || {});
  }, [props.order, setModel]);

  const handleExit = useCallback(() => {
    clearModel();
  }, [clearModel]);

  const [onSubmit] = useCallbackObservable((isValid: boolean) => {
    return of(isValid).pipe(
      filter(isValid => isValid),
      tap(() => setLoading(true)),
      switchMap(() => orderService.save(model as IOrder)),
      tap(
        order => {
          Toast.show(`${order.description} foi salvo${order.id ? '' : ', um email foi enviado com a senha'}`);
          props.onComplete(order);
          setLoading(false);
        },
        err => {
          Toast.error(err.message === 'email-unavailable' ? 'Descrição já existe' : err);
          setLoading(false);
        }
      ),
      logError()
    );
  }, []);

  return (
    <Dialog
      open={props.opened}
      disableBackdropClick
      disableEscapeKeyDown
      onEnter={handleEnter}
      onExited={handleExit}
      TransitionComponent={Transition}
    >
      {loading && <LinearProgress color='secondary' />}

      <FormValidation onSubmit={onSubmit}>
        <DialogTitle>{model.id ? 'Editar' : 'Nova'} Ordem</DialogTitle>
        <DialogContent className={classes.content}>
          {
            <Fragment>
              <FieldText
                label='Nome'
                disabled={loading}
                value={model.description}
                validation='required|min:5|max:300'
                onChange={setModelProp('description', (model, v) => (model.description = v))}
              />

              <FieldText
                label='Quantidade'
                disabled={loading}
                value={model.amount}
                validation='required|number'
                onChange={setModelProp('amount', (model, v) => (model.amount = v))}
              />

              <FieldText
                label='Valor'
                disabled={loading}
                value={model.value}
                validation='required|number'
                onChange={setModelProp('value', (model, v) => (model.value = v))}
              />
            </Fragment>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>Cancelar</Button>
          <Button color='primary' type='submit' disabled={loading}>
            Salvar
          </Button>
        </DialogActions>
      </FormValidation>
    </Dialog>
  );
});

function Transition(props: any) {
  return <Slide direction='up' {...props} />;
}

export default OrderFormDialog;
