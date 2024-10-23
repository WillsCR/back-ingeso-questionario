import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Survey } from './survey.entity';
import { Item } from './item.entity';

@Entity()
export class Dimension {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Survey, survey => survey.dimensions)
  @JoinColumn()
  survey: Survey;

  @OneToMany(() => Item, item => item.dimension)
  items: Item[];
}