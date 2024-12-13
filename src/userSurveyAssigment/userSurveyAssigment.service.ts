import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const assignment = this.assignmentRepository.create({
      userId: CreateAssignmentDto.userId,
      survey: survey,
      endDate: CreateAssignmentDto.endDate,
      userMail: CreateAssignmentDto.userMail,
      signature: CreateAssignmentDto.signature
    });

    return this.assignmentRepository.save(assignment);
  }
  async findAssignmentsExpiringOn(date: Date): Promise<SurveyAssignment[]> {
    return this.assignmentRepository.find({
      where: { endDate: date, completed: false },
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
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiringAssignmentsEveryDay() {
    const today = new Date();
    today.setTime(today.getTime()+1)
    const assignments = await this.assignmentRepository.find({
      where: { endDate: today, completed: false },
    })
    
    for (const assignment of assignments) {
      await this.sendEmailReminder(assignment.userId, assignment.survey.id , assignment.endDate ,); ;
    }
  };
  private async sendEmailReminder(userId: string, surveyId: number , Date: Date) {
    
    const user : User = await this.getUser(userId);
  
    await this.sendSurveyReminder(
      user.firstName + ' ' + user.lastName,
      user.email,
      surveyId,
      Date
    );
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