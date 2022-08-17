import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { EntityRepository } from 'src/common/database/entity.repository';
import { Cart, CartDocument } from './schema/cart.schema';

@Injectable()
export class CartRepository extends EntityRepository<CartDocument> {
  constructor(@InjectModel(Cart.name) readonly cartModel: Model<CartDocument>) {
    super(cartModel);
  }

  async find(
    entityFilterQuery: FilterQuery<CartDocument>,
  ): Promise<CartDocument[] | null> {
    return this.entityModel
      .find(entityFilterQuery)
      .populate('products.productId', 'title price image')
      .exec();
  }
}
