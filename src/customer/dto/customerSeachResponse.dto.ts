import { Expose, Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, IsDateString, Min, Matches, IsArray, IsBoolean } from "class-validator";
import { Customer } from "../interfaces/customer.interface";

export class PageMetaData {
  @IsInt()
  @Expose()
  totalItems!: number;

  @IsInt()
  @Expose()
  totalPages!: number;

  @IsInt()
  @Expose()
  page!: number;

  @IsInt()
  @Expose()
  limit!: number;

  @IsBoolean()
  @Expose()
  hasNextPage!: boolean;

  @IsBoolean()
  @Expose()
  hasPreviousPage!: boolean;
}

export class CustomerSeachResponseDto {
  @Expose()
  @IsArray()
  data!: Customer[];

  @Expose()
  meta!: PageMetaData;
}
