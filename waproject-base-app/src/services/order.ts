import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import cache, { cacheClean } from '~/helpers/rxjs-operators/cache';
import { IOrder } from '~/interfaces/models/order';

import apiService, { ApiService } from './api';
import tokenService, { TokenService } from './token';

export class OrderService {
  constructor(private apiService: ApiService, private tokenService: TokenService) {}

  public get(refresh?: boolean): Observable<IOrder> {
    return this.tokenService.getTokens().pipe(
      switchMap(token => {
        if (!token) {
          return of(null);
        }

        return this.apiService.get<IOrder>('order').pipe(cache('service-order', { refresh }));
      })
    );
  }

  public save(model: IOrder): Observable<IOrder> {
    console.log(model);
    return this.apiService.post<IOrder>('order', model).pipe(cacheClean('service-order'));
  }
}

const orderService = new OrderService(apiService, tokenService);
export default orderService;
