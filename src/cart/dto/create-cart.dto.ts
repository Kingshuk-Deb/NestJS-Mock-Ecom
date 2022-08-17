import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class Product {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  qty: number;
}

export class CreateCartDto {
  @IsArray()
  products: Product[];
}
