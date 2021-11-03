import {  Router } from 'express';
import { getCustomRepository } from 'typeorm';
import {  parseISO } from 'date-fns';

import AppointmentsRepository from '../../../repositories/AppointmentsRepository';
import CreateAppointmentService from '../../../services/infra/CreateAppointmentService';

import ensureAuthenticated from '../../../../users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {
    console.log(request.user);
    
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments =  await appointmentsRepository.find();

    return response.json(appointments);
}); 

appointmentsRouter.post('/', async (request, response) => {

    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);
    
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const createAppointment = new CreateAppointmentService();

    const appointment =  await createAppointment.execute({ provider_id, date: parsedDate })

     return response.json({appointment});

});

export default appointmentsRouter;
