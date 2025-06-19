import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Sex, UsersStatuses } from '@common/enums/users.enum';

@Entity('user_information')
export class UserInformation {
	// ?=================== MAIN DATA COLUMNS ===================

	@PrimaryGeneratedColumn('uuid', {
		comment: 'Identificador único generado en formato UUID.',
	})
	id: string;

	@Column({
		type: 'varchar',
		length: 20,
		nullable: true,
		comment: 'Número del documento de identidad',
	})
	documentNumber: string;

	@Column({
		type: 'varchar',
		length: 255,
		nullable: true,
		comment: 'Nombre del usuario',
	})
	name: string;

	@Column({
		type: 'varchar',
		length: 255,
		nullable: true,
		comment: 'Segundo nombre del usuario',
	})
	secondName: string;

	@Column({
		type: 'varchar',
		length: 255,
		nullable: true,
		comment: 'Apellido paterno del usuario',
	})
	paternalSurname: string;

	@Column({
		type: 'varchar',
		length: 255,
		nullable: true,
		comment: 'Apellido materno del usuario',
	})
	motherSurname: string;

	@Column({
		type: 'varchar',
		length: 255,
		nullable: true,
		comment: 'Nombre completo del usuario',
	})
	fullName: string;

	@Column({
		type: 'text',
		nullable: true,
		comment: 'Razón social de la entidad.',
	})
	businessName: string;

	@Column({
		type: 'enum',
		enum: Sex,
		nullable: true,
		comment: 'Indica el sexo de la persona.',
	})
	sex: Sex;

	@Column({
		type: 'date',
		nullable: true,
		comment: 'Fecha de nacimiento',
	})
	dateBirth: Date;

	@Column({
		type: 'enum',
		enum: UsersStatuses,
		default: UsersStatuses.ENABLED,
		comment: 'Estado del usuario',
	})
	status: string;

	@CreateDateColumn({ comment: 'Fecha de creación' })
	createdAt: Date;

	@UpdateDateColumn({ comment: 'Fecha de última actualización' })
	updatedAt: Date;

	@DeleteDateColumn({ comment: 'Fecha de su eliminación' })
	deletedAt: Date;

	// ?=================== RELATIONS ===================
}
