import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Dimension } from './dimension.entity';
import { Response } from 'src/response/entities/response.entity';
@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  text: string; 
    
  @ManyToOne(() => Dimension, dimension => dimension.items, { onDelete: 'CASCADE' })
  dimension: Dimension;

  @OneToMany(() => Response, (response) => response.item)
  responses: Response[]; 
}