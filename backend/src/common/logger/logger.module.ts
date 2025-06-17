import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global() // Make the LoggerModule global if you want it available throughout the application
@Module({
  providers: [LoggerService],
  exports: [LoggerService], // Export the service so it can be used in other modules
})
export class LoggerModule {}
