import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Survey } from 'src/survey/entities/survey.entity';
import { Item } from 'src/survey/entities/item.entity';
@Entity()
export class Response {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  answer: string;

  @ManyToOne(() => Survey, survey => survey.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  survey: Survey;

  @ManyToOne(() => Item, item => item.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  item: Item;

  @Column()
  subject: string;

  @Column()
  surveyId: number;
}
