import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from 'src/common/database/entity.repository';
import { Order, OrderDocument } from './schema/order.schema';

@Injectable()
export class OrderRepository extends EntityRepository<OrderDocument> {
  constructor(
    @InjectModel(Order.name) readonly orderModel: Model<OrderDocument>,
  ) {
    super(orderModel);
  }
}
