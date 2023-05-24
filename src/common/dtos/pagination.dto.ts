import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto{

    @ApiProperty({
        default: 10, description:' how many rows do you need'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) //enablImplicitConversion:true
    limit?:number;

    @ApiProperty({
        default: 0, description:' how many rows do you need'
    })
    @IsOptional()
    @Type(() => Number)
    offset?: number;


}
