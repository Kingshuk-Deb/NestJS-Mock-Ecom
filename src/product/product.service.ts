import { Injectable, UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  create(createProductDto: CreateProductDto, creatorId: string) {
    return this.productRepository.create({
      ...createProductDto,
      createdBy: new mongoose.Types.ObjectId(creatorId),
    });
  }

  group(products: any) {
    return products.reduce
  }

  async findAll() {
    const products = await this.productRepository.find({ isDeleted: false });
    const groupProduct = products.reduce((acc, prod) => {
      const cat = prod['category'];
      if(!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(prod);
      return acc;
    }, {});
    console.log(groupProduct);
    return this.productRepository.find({ isDeleted: false });
  }

  findByCategory(category: string) {
    return this.productRepository.find({
      category,
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    creatorId: string,
  ) {
    const isCreator = await this.productRepository.findByID(id);
    if (isCreator.createdBy.toString() === creatorId)
      return this.productRepository.findByIdAndUpdate(id, updateProductDto);
    throw new UnauthorizedException('You are not the creator of this product!');
  }

  remove(id: string) {
    return this.productRepository.findByIdAndUpdate(id, { isDeleted: true });
  }
}
