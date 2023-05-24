import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/auth.entity';
import * as bcrypt from 'bcrypt'


@Injectable()
export class SeedService {
  constructor(  
  private readonly  productService: ProductsService,
  @InjectRepository(User)
  private readonly userRepository: Repository<User>
  ){

  }


  async runSeed(){

    this.deleteTables();
    const adminUser=await this.insertUsers();
    await this.insertNewProducts(adminUser);
    return 'SEED EXECUTED';
  }

  private async deleteTables(){
    await this.productService.deleteAllProduct();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
    .delete()
    .where({})
    .execute()
  }


  private async insertUsers(){
    const seedUsers = initialData.users;

    const users: User[] =[];
    seedUsers.forEach(user => {
      users.push(this.userRepository.create({...user,
        password: bcrypt.hashSync(user.password, 10)}))
    });

    const dbUser = await this.userRepository.save(seedUsers)
    return dbUser[0];

  }
 async insertNewProducts(user: User){

  await  this.productService.deleteAllProduct()
  const products= initialData.products;
  const insertPromise=[];

  products.forEach(product => {
    insertPromise.push(this.productService.create(product,user));
    
  });
  console.log(insertPromise);
  
  await Promise.all(insertPromise)
  
  }
}
