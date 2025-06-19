import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from '@entities/users/user.entity';
import { Statuses } from '@common/enums/general.enum';

@Entity('dashboard')
export class DashboardEntity {
	// ?=================== MAIN DATA COLUMNS ===================

	@PrimaryGeneratedColumn()
	id: string;

	@Column({
		type: 'char',
		nullable: true,
		comment: 'Identificador del usuario a la que pertenece el dashboard.',
	})
	userId: string;

	@Column({
		type: 'text',
		nullable: true,
		comment: 'Componentes del dashboard',
	})
	components: string;

	@Column({
		type: 'enum',
		enum: Statuses,
		default: Statuses.ENABLED,
		comment: 'Estado del dashboard',
	})
	status: string;

	@CreateDateColumn({ comment: 'Fecha de creación' })
	createdAt: Date;

	@UpdateDateColumn({ comment: 'Fecha de última actualización' })
	updatedAt: Date;

	@DeleteDateColumn({ comment: 'Fecha de su eliminación' })
	deletedAt: Date;

	// ?=================== RELATIONS ===================

	@ManyToOne(() => User, (user) => user.dashboards)
	@JoinColumn({ name: 'userId' })
	user: User;
}
