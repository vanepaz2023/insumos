import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { title } from 'process';
import { ProductImage, Product } from './entities';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) { }

  async create(createProductDto: CreateProductDto, user: User) {
    console.log("productos que llegan", createProductDto);

    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        user,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      })

      await this.productRepository.save(product);
      return product;



    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException("Ayuda!");


    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto

    const product = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    }
    )
    return product.map(product => ({
      ...product,
      image: product.images.map(img => img.url)

    }))
  }

  async findOne(term: string) {

    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or estado =:estado', {
          title: term.toUpperCase(),
          estado: term.toLowerCase()

        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();

    }

    //const product = await this.productRepository.findOneBy({ id })

    if (!product) {
      throw new NotFoundException(`Product with id ${term} not found`);


    }
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url)

    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...toUpdate });
    
    if (!product) throw new NotFoundException(`Product with id: ${id} not found `);
    //create query runner
    /* la transaccion puede tener monton de querys */
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } })
        product.images = images.map(
          image => this.productImageRepository.create({ url: image })
        )
      } else {

      }
product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);


      // await this.productRepository.save(product);
      return product;
    } catch (error) {
      //this.handleDBExceptions(error)
      await queryRunner.rollbackTransaction();
      await queryRunner.release()

    }
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
  }

  private handleDBExceptions(error:any){

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
      this.logger.error(error)
      throw new InternalServerErrorException('Unexpected error, check server logs')
      
    }

  }
  async deleteAllProduct(){
    const query = this.productRepository.createQueryBuilder('product');
    try{
      return await query
      .delete()
      .where({})
      .execute();

    }catch(error){
      this.handleDBExceptions(error)
    }

  }
}
