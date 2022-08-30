import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { EntityRepository } from 'src/common/database/entity.repository';
import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductRepository extends EntityRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name) readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  async getCategories(): Promise<ProductDocument[] | null> {
    return this.entityModel.aggregate([
      {
        '$group': {
          '_id': '$category'
        }
      }
    ])
  }
}
