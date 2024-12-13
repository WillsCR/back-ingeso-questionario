import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Dimension } from './dimension.entity';
import { SurveyAssignment } from 'src/userSurveyAssigment/entities/userSurveyAssigment.entity';
@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  subject: string;
  
  @OneToMany(() => Dimension, dimension => dimension.survey,{ cascade: true })
  dimensions: Dimension[];

  @OneToMany(() => SurveyAssignment, assignment => assignment.survey)
  assignments: SurveyAssignment[];
}