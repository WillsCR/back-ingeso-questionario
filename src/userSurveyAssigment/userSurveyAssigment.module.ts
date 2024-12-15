import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyAssignmentService } from './userSurveyAssigment.service';
import { SurveyAssignmentController } from './userSurveyAssigment.controller';
import { SurveyAssignment } from './entities/userSurveyAssigment.entity';
import { Survey } from 'src/survey/entities/survey.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Global()
@Module({
  
  imports: [
    TypeOrmModule.forFeature([SurveyAssignment, Survey]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'ucnexample@gmail.com',
          pass: 'nzqh hmno guar eveg',
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
