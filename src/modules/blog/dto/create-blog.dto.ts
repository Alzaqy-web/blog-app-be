import { IsNotEmpty, IsString } from "class-validator";
import { PaginationQuaryParams } from "../../pagination/dto/pagination.dto";

export class CreateBlogDTO extends PaginationQuaryParams {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  content!: string;

  @IsNotEmpty()
  @IsString()
  category!: string;
}
