import { ApiModelProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationValidator } from 'modules/common/validators/pagination';

export class ListValidator extends PaginationValidator {
  @IsString()
  @IsOptional()
  @IsIn(['description', 'amount', 'value', 'createdDate', 'updatedDate'])
  @ApiModelProperty({ required: false, enum: ['description', 'amount', 'value', 'createdDate', 'updatedDate'] })
  public orderBy: string;
}
