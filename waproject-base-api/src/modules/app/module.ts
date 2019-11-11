import { HttpModule, Module } from '@nestjs/common';
import { CommonModule } from 'modules/common/module';
import { DatabaseModule } from 'modules/database/module';

import { AuthController } from './controllers/auth';
import { OrderController } from './controllers/order';
import { ProfileController } from './controllers/profile';
import { DeviceRepository } from './respoitories/device';
import { OrderRepository } from './respoitories/order';
import { UserRepository } from './respoitories/user';
import { AuthService } from './services/auth';
import { OrderService } from './services/order';
import { UserService } from './services/user';

@Module({
  imports: [HttpModule, CommonModule, DatabaseModule],
  controllers: [AuthController, ProfileController, OrderController],
  providers: [AuthService, UserService, OrderService, UserRepository, DeviceRepository, OrderRepository]
})
export class AppModule {}
