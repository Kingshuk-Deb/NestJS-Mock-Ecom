import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly cartService: CartService,
    private readonly orderRepository: OrderRepository,
  ) {}

  async create(creatorId: string) {
    const currentCart = await this.cartService.getCurrentCart(creatorId);
    const totalPrice = currentCart.products
      .map((product: any) => {
        return {
          price: product.productId.price,
          qty: product.qty,
        };
      })
      .reduce((acc, curr) => {
        return acc + curr.price * curr.qty;
      }, 0);
    return this.orderRepository.create({
      cartId: currentCart._id,
      totalPrice,
      createdBy: new mongoose.Types.ObjectId(creatorId),
    });
  }

  async payOrder(id: string) {
    const order = await this.orderRepository.findByIdAndUpdate(id, {
      isPaid: true,
    });
    const creatorId = order.createdBy.toString();
    const cartId = order.cartId.toString();
    await this.cartService.update(cartId, { isPaid: true }, creatorId);
    return order;
  }

  getPaidOrders(creatorId: string) {
    return this.cartService.getPaidCarts(creatorId);
  }
}
