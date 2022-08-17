import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { OrderService } from './order.service';

@Controller('order')
@UseGuards(AccessTokenGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Req() req) {
    const userId = req.user['id'];
    return this.orderService.create(userId);
  }

  @Patch('/pay/:id')
  payOrder(@Param('id') orderId: string) {
    return this.orderService.payOrder(orderId);
  }

  @Get('paid')
  findAll(@Req() req) {
    const userId = req.user['id'];
    return this.orderService.getPaidOrders(userId);
  }
}
