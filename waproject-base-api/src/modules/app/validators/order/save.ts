import { ApiModelProperty } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { IOrder } from 'interfaces/models/order';

export class SaveValidator implements IOrder {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiModelProperty({ required: true, type: 'integer' })
  public id?: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  @ApiModelProperty({ required: true, type: 'string', minLength: 5, maxLength: 200 })
  public description: string;

  @IsNotEmpty()
  @IsInt()
  @ApiModelProperty({ required: false, type: 'integer' })
  public amount: number;

  @IsNotEmpty()
  @IsDecimal()
  @ApiModelProperty({ required: true, type: 'number' })
  public value: number;
}
