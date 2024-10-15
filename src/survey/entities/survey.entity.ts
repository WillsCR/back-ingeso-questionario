import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Response } from 'src/response/entities/response.entity';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => Response, response => response.survey)
  responses: Response[];
}