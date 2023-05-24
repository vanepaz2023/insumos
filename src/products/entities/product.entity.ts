import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/auth.entity";
import { BeforeInsert, Column, Entity, LegacyOracleNamingStrategy, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({
        example:'129f9110-cae7-49f4-be68-094c148bca21',
        description:'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'Pendrive',
        description:'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;


    @ApiProperty({
        example:'30,89',
        description:'Product Price',
        uniqueItems: true
    })
    @Column('numeric', {
        default: 0
    })
    price: number


    @ApiProperty({
        example:'Tecnologia',
        description:'Product Category',
        uniqueItems: true
    })
    @Column('text', {
        nullable: true
    })
    category: string


    @ApiProperty({
        example:'true',
        description:'Product status'
       
    })
    @Column({
        type: 'text',
        nullable: true

    })
    estado: string;



    @ApiProperty({
        example:'lsjflksf sfsfslfjsf sfjsdfkljsd sfljskfjskldfj',
        description:'Product Descriptions',
    
    })
    @Column({
        type: 'text',
        nullable: true

    })
    description: string;


    @ApiProperty({
        example:90,
        description:'Product stock',
   
    })
    @Column({
        type: 'numeric',


    })
    stock: number;

    @Column({
        type: 'date',


    })
    dateCreation: Date;

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @OneToMany(
        () => User,
        (user) => user.product,
    )

    user: User


    @BeforeInsert()
    checkSlugInsert() {
        if (!this.dateCreation) {
            this.dateCreation = new Date()

        }

    }
}
