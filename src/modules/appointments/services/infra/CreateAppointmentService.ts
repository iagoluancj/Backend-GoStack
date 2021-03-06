import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../../../../shared/errors/AppError';

import Appointment from '../../infra/typeorm/entities/Appointment';
import AppointmentsRepository from '../../repositories/AppointmentsRepository';

/**
 * Recebimento de Informações
 * Tratativa de Erros/excessões
 * Acesso ao repositório 
 */

interface RequestDTO{   
    provider_id: string;
    date: Date;
    
};

class CreateAppointmentService {
    public async execute({date, provider_id}: RequestDTO): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    
        const appointmentDate = startOfHour(date);
        
        const findAppoitmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
            );

        if (findAppoitmentInSameDate) {
            throw new AppError('This appointment is already booked')
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate
        });

        await appointmentsRepository.save(appointment);

        return appointment;
        }
}

export default CreateAppointmentService;