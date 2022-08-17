import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Controller('cart')
@UseGuards(AccessTokenGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @Req() req) {
    const userId = req.user['id'];
    return this.cartService.create(createCartDto, userId);
  }

  @Get('current')
  findCurrentCart(@Req() req) {
    const userId = req.user['id'];
    return this.cartService.getCurrentCart(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() createCartDto: CreateCartDto,
    @Req() req,
  ) {
    const userId = req.user['id'];
    return this.cartService.update(id, createCartDto, userId);
  }
}
