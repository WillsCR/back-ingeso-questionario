import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Survey } from 'src/survey/entities/survey.entity';

@Entity()
export class SurveyAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string; 

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ default: false })
  completed: boolean; 

  @ManyToOne(() => Survey, survey => survey.assignments, { onDelete: 'CASCADE' })
  survey: Survey;

  @Column()
  userMail: string

  @Column()
  signature: string

}
