import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Item } from 'src/survey/entities/item.entity';

@Entity()
export class Response {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; 

  @Column()
  answer: string; 

  
  @Column()
  itemId: number; 

 
  @ManyToOne(() => Item, { onDelete: 'CASCADE' })
  item: Item; 
}
