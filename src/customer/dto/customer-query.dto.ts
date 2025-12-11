import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, IsDateString, Min, Matches } from "class-validator";

export class CustomerQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(["fullName", "registrationDate"])
  sort?: "fullName" | "registrationDate";

  @IsOptional()
  @IsIn(["asc", "desc"])
  order?: "asc" | "desc" = "asc";

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[^@\s]+\.[^@\s]+$/, { message: "emailDomain should look like domain.com" })
  emailDomain?: string;
}
