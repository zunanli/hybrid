import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Mapping } from './mapping.entity';

export enum Platform {
  IOS = 'ios',
  ANDROID = 'android',
}

@Entity('versions')
@Index(['platform', 'version'], { unique: true })
export class Version {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Platform,
  })
  platform: Platform;

  @Column({ length: 50 })
  version: string;

  @Column({ length: 50, nullable: true })
  minVersion: string;

  @Column({ length: 50, nullable: true })
  maxVersion: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Mapping, (mapping) => mapping.appVersion)
  mappings: Mapping[];

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
