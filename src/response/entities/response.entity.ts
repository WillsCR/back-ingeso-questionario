import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Question } from 'src/survey/entities/question.entity';
@Entity()
export class Response {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  answer: string;

  @ManyToOne(() => Question, question => question.responses)
  question: Question;
}