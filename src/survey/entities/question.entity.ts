import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Survey } from 'src/survey/entities/survey.entity';
import { Response } from 'src/response/entities/response.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Survey, survey => survey.questions)
  survey: Survey;

  @OneToMany(() => Response, response => response.question)
  responses: Response[];
}