import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
	@IsEmail({}, { message: 'Ingrese un correo electrónico correcto.' })
	@IsNotEmpty({ message: 'El correo electrónico es requerido.' })
	email: string;

	@IsNotEmpty({ message: 'La contraseña es requerida.' })
	password: string;
}
