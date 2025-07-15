import { IsOptional, IsString } from "class-validator";
import { PaginationQuaryParams } from "../../pagination/dto/pagination.dto";

export class GetBlogDTO extends PaginationQuaryParams {
  @IsOptional()
  @IsString()
  search?: string;
}
