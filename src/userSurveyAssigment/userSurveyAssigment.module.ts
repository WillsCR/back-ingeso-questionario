import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyAssignmentService } from './userSurveyAssigment.service';
import { SurveyAssignmentController } from './userSurveyAssigment.controller';
import { SurveyAssignment } from './entities/userSurveyAssigment.entity';
import { Survey } from 'src/survey/entities/survey.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Global()
@Module({
  //CONFIGURAR LUEGO CUANDO SEPA USARLO
  imports: [
    TypeOrmModule.forFeature([SurveyAssignment, Survey]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: 'pids.email.test@gmail.com',
          pass: 'pdpr estp idlw iajo',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  providers: [SurveyAssignmentService],
  controllers: [SurveyAssignmentController],
  exports: [SurveyAssignmentService],
})
export class SurveyAssignmentModule {}
