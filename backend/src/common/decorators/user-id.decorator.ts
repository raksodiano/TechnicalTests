import {
	createParamDecorator,
	ExecutionContext,
	HttpException,
	HttpStatus,
} from '@nestjs/common';

export const UserId = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const { user } = request;

		if (!user) {
			throw new HttpException(
				'El Token no se pudo procesar',
				HttpStatus.UNPROCESSABLE_ENTITY,
			);
		}

		return user?.user_id;
	},
);
