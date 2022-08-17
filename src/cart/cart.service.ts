import { Injectable, UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';
import { CartRepository } from './cart.repository';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async create(createCartDto: CreateCartDto, creatorId: string) {
    return (
      await this.cartRepository.create({
        ...createCartDto,
        createdBy: new mongoose.Types.ObjectId(creatorId),
      })
    ).populate('products.productId', 'title price image');
  }

  async getCurrentCart(creatorId: string) {
    const hasCurrentCart = await this.cartRepository.findOne({
      createdBy: new mongoose.Types.ObjectId(creatorId),
      isPaid: false,
    });
    if (!hasCurrentCart)
      return await this.cartRepository.create({
        products: [],
        createdBy: new mongoose.Types.ObjectId(creatorId),
      });
    return hasCurrentCart.populate('products.productId', 'title price image');
  }

  async getPaidCarts(creatorId: string) {
    return this.cartRepository.find({
      createdBy: new mongoose.Types.ObjectId(creatorId),
      isPaid: true,
    });
  }

  async update(id: string, updateProductDto: any, creatorId: string) {
    const isCreator = await this.cartRepository.findByID(id);
    if (isCreator.createdBy.toString() === creatorId)
      return (
        await this.cartRepository.findByIdAndUpdate(id, updateProductDto)
      ).populate('products.productId', 'title price image');
    throw new UnauthorizedException('You are not the creator of this product!');
  }
}
