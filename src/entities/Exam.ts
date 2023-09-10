import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "./Question";

@ObjectType()
@Entity()
export class Exam extends BaseEntity {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  timeStart: Date;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @Column()
  timeEnd: Date;

  @Field()
  @Column()
  time: number;

  @Field(() => [Question])
  @ManyToMany(() => Question, (question) => question.id)
  @JoinTable()
  questions: Question[];
}
