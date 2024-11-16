import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyAssignment } from './entities/userSurveyAssigment.entity';
import {Cron, CronExpression } from '@nestjs/schedule';
import { ResponseMessage } from 'src/types/message';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
@Injectable()
export class SurveyAssignmentService {
  constructor(
    @InjectRepository(SurveyAssignment)
    private readonly assignmentRepository: Repository<SurveyAssignment>,
    private mailerService: MailerService
  ) {}

  async createAssignment(data: Partial<SurveyAssignment>): Promise<SurveyAssignment> {
    const assignment = this.assignmentRepository.create(data);
    return this.assignmentRepository.save(assignment);
  }

  async findAssignmentsExpiringOn(date: Date): Promise<SurveyAssignment[]> {
    return this.assignmentRepository.find({
      where: { endDate: date, completed: false },
      relations: ['survey'],
    });
  }

  async markAsCompleted(assignmentId: number): Promise<void> {
     await this.assignmentRepository.update(assignmentId, { completed: true });
     
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiringAssignmentsEveryDay() {
    const today = new Date();
    today.setTime(today.getTime()+1)
    const assignments = await this.assignmentRepository.find({
      where: { endDate: today, completed: false },
    })
    
    for (const assignment of assignments) {
      await this.sendEmailReminder(assignment.userId, assignment.survey.id , assignment.endDate); ;
    }
  };

  //PARTES A CAMBIAR 
  private async sendEmailReminder(userId: string, surveyId: number , Date: Date) {
    
    const userEmail = await this.getUserEmail(userId);
  //CAMBIAR ESTO CUANDO TENGA ALGUN TIPO DE GET USUARIO POR ID
    await this.sendSurveyReminder(
     'John Doe',
      userEmail,
      surveyId,
      Date
    );
  }
  //AQUI CONECTAR AL OTRO SERVICIO
  private async getUserEmail(userId: string): Promise<string> {
    return `user${userId}@example.com`;
  }
  
  //PARA PROBAR SIN CONECTAR AL OTRO SERVICIO
  async sednEmail(surveyId: number ) {
    const userEmail = 'drkoppa.10@gmail.com'
    const date = new Date();
    date.setTime(date.getTime()+1);
    await this.sendSurveyReminder(
      'John Doe',
      userEmail,
      surveyId,
      date
    );
  }

  async sendSurveyReminder(userName: string, userEmail: string, surveyId: number, endDate: Date): Promise<SentMessageInfo> {
    const surveyLink = process.env.CLIENT_URL;
    return await this.mailerService.sendMail({
      to: userEmail,
      from: '"Equipo de soporte" <support@example.com>',
      subject: 'Recordatorio de Encuesta Pendiente',
      html: `
      <html>
      <head>
        <title>Recordatorio de Encuesta Pendiente</title>
        <style>
          .contenedor {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1 style="text-align: center;">Recordatorio de Encuesta Pendiente</h1>
        <p>¡Hola ${userName}! 👋</p>
        <p>Te recordamos que tienes una encuesta pendiente por responder, la cual vence el <strong>${endDate.toLocaleDateString()}</strong>.</p>
        <p>Para responder la encuesta, haz clic en el siguiente enlace:</p>
        <div style="text-align: center; margin: 20px;">
          <a href="${surveyLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Responder Encuesta
          </a>
        </div>
        <br>
        <p><em>Si ya has respondido la encuesta, por favor ignora este mensaje.</em></p>
      </body>
      </html>
      `,
    });

  }

}