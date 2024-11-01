import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Survey } from './survey.entity';
import { Item } from './item.entity';

export enum DimensionType {
  AGREED_LEVEL = 'Agreedlevel',
  FREE_TEXT = 'freetext',
  IDENTIDAD = 'Identidad',
  AGREED_LEVEL_2 = 'Agreedlevel2'
}

@Entity()
export class Dimension {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: DimensionType,
    default: DimensionType.FREE_TEXT, 
  })
  tipo: DimensionType;

  @ManyToOne(() => Survey, survey => survey.dimensions, { onDelete: 'CASCADE' })
  @JoinColumn()
  survey: Survey;

  @OneToMany(() => Item, item => item.dimension, { cascade: true })
  items: Item[];
}