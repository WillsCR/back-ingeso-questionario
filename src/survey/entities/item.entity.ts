import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Dimension } from './dimension.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string; 

  @ManyToOne(() => Dimension, dimension => dimension.items)
  dimension: Dimension;

  
}