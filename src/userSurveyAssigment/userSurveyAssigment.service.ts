import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { SurveyAssignment } from './entities/userSurveyAssigment.entity';
import {Cron, CronExpression } from '@nestjs/schedule';
import { ResponseMessage } from 'src/types/message';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { User } from './types';
import axios from 'axios';
import { Survey } from 'src/survey/entities/survey.entity';
import { CreateAssignmentDto } from './dto/surveyAssigment.dto';
@Injectable()
export class SurveyAssignmentService {
  constructor(
    @InjectRepository(SurveyAssignment)
    private readonly assignmentRepository: Repository<SurveyAssignment>,
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
    private mailerService: MailerService
  ) {}

  async createAssignment(
    CreateAssignmentDto: CreateAssignmentDto
  ): Promise<SurveyAssignment> {
   
    const survey = await this.surveyRepository.findOne({ where: { id: CreateAssignmentDto.surveyId } });
    if (!survey) {
      throw new Error('Survey not found');
    }
    const date = new Date(CreateAssignmentDto.endDate);
    const assignment = this.assignmentRepository.create({
      userId: CreateAssignmentDto.userId,
      survey: survey,
      endDate: date,
      userMail: CreateAssignmentDto.userMail,
      signature: CreateAssignmentDto.signature
    });
 
    return this.assignmentRepository.save(assignment);
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async checkExpiringAssignmentsEveryDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); 
  console.log(tomorrow);
  const assignments = await this.findAssignmentsExpiringOn(tomorrow);
  console.log(assignments);
  for (const assignment of assignments) {
    await this.sendEmailReminder(
      assignment.userId,
      assignment.survey.id,
      assignment.endDate,
      assignment.userMail
    );
  }
}

 
async findAssignmentsExpiringOn(date: Date): Promise<SurveyAssignment[]> {
  
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);  
  console.log(startOfDay);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);  
  console.log(endOfDay);
  return this.assignmentRepository.find({
    where: {
      endDate: Between(startOfDay, endOfDay),  
      completed: false,
    },
    relations: ['survey'],
  });
}
  async markAsCompleted(userId: string, surveyId: number ): Promise<String> {
      const assignment = await this.assignmentRepository.findOne({
        where: { userId, survey: { id: surveyId } },
        relations: ['survey'],
      });
     if (!assignment) {
        throw new Error('Assignment not found');
      }
      assignment.completed = true;
      await this.assignmentRepository.save(assignment);
      return "La encuesta ha sido respondida";
  }
  
  private async sendEmailReminder(userId: string, surveyId: number , Date: Date, userMail: string) {
    await this.sendSurveyReminder(
      userMail,
      Date
    );
    console.log('Email reminder sent successfully');
  }
  
  private async getUser(userId: string): Promise<User> {
    try {
      const response = await axios.get<User>(`${process.env.PUERTO_USER}/user/${userId}`);
      return response.data; 
    } catch (error) {
      console.error(`Error al obtener el usuario con ID ${userId}:`, error);
      throw new Error('No se pudo obtener el usuario');
    }
  }

  async testsendEmail(userMail: string, endDate: Date) {
    await this.sendSurveyReminder(
      userMail,
      endDate
    );
  }

  async sendSurveyReminder( userEmail: string, endDate: Date): Promise<SentMessageInfo> {
    const surveyLink = process.env.CLIENT_URL;
    const formattedDate  = new Date(endDate).toLocaleDateString('es-CL');  // Convertir y formatear
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
        <p>¡Hola ! 👋</p>
        <p>Te recordamos que tienes una encuesta pendiente por responder, la cual vence el <strong>${formattedDate}</strong>.</p>
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

  async getUncompletedAssignments(): Promise<SurveyAssignment[]> {
    return this.assignmentRepository.find({
      where: { completed: false },
      relations: ['survey'],
    });
  }

  async getCompletedAssignments(): Promise<SurveyAssignment[]> {
    return this.assignmentRepository.find({
      where: { completed: true },
      relations: ['survey'],
    });
  }

    
  async surveyHasDeadline(surveyId: number): Promise<boolean> {
    const assignment = await this.assignmentRepository.findOne({
      where: { survey: { id: surveyId } },
    });
    //true si existe surveyId entre los assignment, else false
    return !!assignment;
  }

}