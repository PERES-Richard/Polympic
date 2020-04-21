import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AnonymousIncidentRepository} from "./anonymous-incident.repository";
import {AnonymousIncidentModule} from "./anonymous-incident.module";
import {AnonymousIncidentService} from "./anonymous-incident.service";
import {CreateAnonymousIncidentDto} from "./dto/create-incident.dto";
import {database_test_config} from '../../config';

describe('Anonymous Incident Controller', () => {
  let app: INestApplication;
  let repository: AnonymousIncidentRepository;
  let service: AnonymousIncidentService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AnonymousIncidentModule,
        TypeOrmModule.forRoot(database_test_config),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    repository = module.get<AnonymousIncidentRepository>(AnonymousIncidentRepository);
    service = module.get<AnonymousIncidentService>(AnonymousIncidentService);
  });

  afterAll(async (done) => {
    await app.close();
    done();
  });

  beforeEach(async () => {
    await repository.query('DELETE FROM anonymous_incident WHERE 1;');
  });

  afterEach(async () => {
    await repository.query('DELETE FROM anonymous_incident WHERE 1;');
  });

  describe('Service addIncident', () => {
    it('Should return the anonymous-incident added', async () => {
      //data to send
      const incidentBody = new CreateAnonymousIncidentDto(22.5, 20.3);
      let res = await service.addAnonymousIncident(incidentBody);
      expect(res.latitude).toBe(22.5);
      expect(res.longitude).toBe(20.3);

      let values = await repository.find();
      expect(values.length).toBe(1);

      const incident2Body = new CreateAnonymousIncidentDto(25.5, 25.3);
      let res2 = await service.addAnonymousIncident(incident2Body);
      expect(res2.latitude).toBe(25.5);
      expect(res2.longitude).toBe(25.3);

      let values2 = await repository.find();
      expect(values2.length).toBe(2);
    });
  });

});
