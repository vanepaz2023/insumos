import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
export class CreateProductDto {

@ApiProperty({
    description: 'Product title (unique)',
    nullable: false,
    minLength: 1
})
@IsString()
@MinLength(1) 
title: string;

@ApiProperty()
@IsNumber()
@IsPositive()
@IsOptional()
price: number;

@ApiProperty()
@IsString()
category: string;

/* @IsIn(['nuevo','usado'])
estado: string; */

@ApiProperty()
@IsString()
@IsOptional()
description?: string;

@ApiProperty()
@IsInt()
@IsPositive()
@IsOptional()
stock?: number;

@ApiProperty()
@IsString({each:true})
@IsArray()
@IsOptional()
images?: string[];


}
