import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Package } from './package.entity';
import { Version } from './version.entity';

@Entity('mappings')
@Index(['appVersionId', 'packageId'], { unique: true })
export class Mapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'app_version_id' })
  appVersionId: number;

  @Column({ name: 'package_id' })
  packageId: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Version, (version) => version.mappings)
  @JoinColumn({ name: 'app_version_id' })
  appVersion: Version;

  @ManyToOne(() => Package, (pkg) => pkg.mappings)
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
