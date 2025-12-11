import { Controller, Get, Query } from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { CustomerQueryDto } from "./dto/customer-query.dto";
import { ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags("customers")
@Controller("customers")
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get()
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number", example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Items per page", example: 10 })
  @ApiQuery({ name: "search", required: false, type: String, description: "Search by customer name or other fields" })
  @ApiQuery({ name: "sort", required: false, enum: ["fullName", "registrationDate"], description: "Sort by field" })
  @ApiQuery({ name: "order", required: false, enum: ["asc", "desc"], description: "Sort order", example: "asc" })
  @ApiQuery({ name: "dateFrom", required: false, type: String, description: "Filter from date (YYYY-MM-DD)" })
  @ApiQuery({ name: "dateTo", required: false, type: String, description: "Filter to date (YYYY-MM-DD)" })
  @ApiQuery({
    name: "emailDomain",
    required: false,
    type: String,
    description: "Filter by email domain (e.g., domain.com)",
  })
  async findAll(@Query() query: CustomerQueryDto) {
    const result = await this.service.getPaginated(query);
    return result;
  }
}
