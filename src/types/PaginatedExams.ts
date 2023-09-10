import { Exam } from "../entities/Exam";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PaginatedExams {
  @Field()
  totalCount: number;

  @Field()
  cursor: Date;

  @Field()
  hasMore: boolean;

  @Field((_returns) => [Exam])
  paginatedExams: Exam[];
}
