import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from 'src/models/person.entity';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './personDto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person) private readonly personRepo: Repository<Person>,
  ) {}

  async createPerson(person: CreatePersonDto, institutionId?: string) {
    try {
      const newPerson = this.personRepo.create(person);
      return await this.personRepo.save(newPerson);
    } catch (error) {
      throw new UnprocessableEntityException({ message: error.message });
    }
  }

  async updatePerson(person: Person) {
    await this.personRepo.save(person);
  }

  async getPerson( phone?: string, personId?: string) {
    return await this.personRepo.findOne({where: [{
      personId
    }, {phone}]})
  }

  async editPerson(phone: string, editPersonDto: any){
    const person = await this.getPerson(phone)
    await this.personRepo.save({...person, ...editPersonDto,})
  }

  
}
