import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Dimension } from './dimension.entity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  subjectName: string; // Nombre de la asignatura

  @Column()
  professorName: string; // Profesor de la asignatura

  @Column({ nullable: true })
  studentName?: string; // Nombre del alumno (opcional)

  @OneToMany(() => Dimension, dimension => dimension.survey)
  dimensions: Dimension[];
}