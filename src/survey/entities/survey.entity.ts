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

  @OneToMany(() => Dimension, dimension => dimension.survey,{ cascade: true })
  dimensions: Dimension[];
}