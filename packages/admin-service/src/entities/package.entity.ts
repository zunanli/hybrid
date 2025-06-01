import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Mapping } from './mapping.entity';

@Entity('packages')
@Index(['name', 'version'], { unique: true })
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  version: string;

  @Column('text')
  description: string;

  @Column('bigint')
  size: number;

  @Column()
  url: string;

  @Column({ length: 64 })
  hash: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Mapping, (mapping) => mapping.package)
  mappings: Mapping[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
