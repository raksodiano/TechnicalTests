import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UsersStatuses } from '@common/enums/users.enum';
import { DashboardEntity } from '@entities/dashboard/dashboard.entity';

@Entity('users')
export class User {
	// ?=================== MAIN DATA COLUMNS ===================

	@PrimaryGeneratedColumn()
	id: string = uuidv4();

	@Column({
		type: 'varchar',
		length: 255,
		unique: true,
		comment: 'Email del usuario',
	})
	email: string;

	@Column({
		type: 'varchar',
		length: 255,
		comment: 'Contraseña del usuario',
	})
	password: string;

	@Column({
		type: 'enum',
		enum: UsersStatuses,
		default: UsersStatuses.ENABLED,
		comment: 'Estado de la cuenta del usuario',
	})
	status: string;

	@CreateDateColumn({ comment: 'Fecha de creación' })
	createdAt: Date;

	@UpdateDateColumn({ comment: 'Fecha de última actualización' })
	updatedAt: Date;

	@DeleteDateColumn({ comment: 'Fecha de su eliminación' })
	deletedAt: Date;

	// ?=================== RELATIONS ===================

	@OneToMany(() => DashboardEntity, (item) => item.user)
	dashboards: DashboardEntity[];
}
