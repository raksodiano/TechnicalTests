import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UsersStatuses } from '@common/enums/users.enum';
import { UserInformation } from '@entities/users/user-info.entity';

@Entity('users')
export class User {
	// ?=================== MAIN DATA COLUMNS ===================

	@PrimaryGeneratedColumn('uuid')
	id: string = uuidv4();

	@Column('varchar', {
		comment: 'Email del usuario',
		length: 255,
		unique: true,
	})
	email: string;

	@Column('varchar', {
		comment: 'Contraseña del usuario',
		length: 255,
	})
	password: string;

	@Column({
		comment: 'Estado de la cuenta del usuario',
		type: 'enum',
		enum: UsersStatuses,
		default: UsersStatuses.DISABLED,
	})
	status: string;

	@CreateDateColumn({ comment: 'Fecha de creación' })
	createdAt: Date;

	@UpdateDateColumn({ comment: 'Fecha de última actualización' })
	updatedAt: Date;

	@DeleteDateColumn({ comment: 'Fecha de su eliminación' })
	deletedAt: Date;

	// ?=================== RELATIONS ===================

	@OneToOne(() => UserInformation, (userInformation) => userInformation.user)
	userInfo: UserInformation;
}
