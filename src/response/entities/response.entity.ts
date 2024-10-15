import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Survey } from 'src/survey/entities/survey.entity';

@Entity()
export class Response {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;
  
  @Column()
  surveyId: number;

  @Column()
  answer: string;

  @ManyToOne(() => Survey, survey => survey.responses)
  survey: Survey;
}

