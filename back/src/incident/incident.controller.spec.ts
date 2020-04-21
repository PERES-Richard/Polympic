import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import supertest = require('supertest');
import {IncidentRepository} from "./incident.repository";
import {IncidentService} from "./incident.service";
import {IncidentModule} from "./incident.module";
import {CreateIncidentDto} from "./dto/create-incident.dto";
import {database_test_config} from '../config';

describe('Incident Controller', () => {
  let app: INestApplication;
  let repository: IncidentRepository;
  let service: IncidentService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        IncidentModule,
        TypeOrmModule.forRoot(database_test_config),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    repository = module.get<IncidentRepository>(IncidentRepository);
    service = module.get<IncidentService>(IncidentService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await repository.query('DELETE FROM anonymous_incident WHERE 1;');
  });

  describe('POST /incident', () => {
    it('should return the incident added', async () => {
      //data to send
      const incidentBody = new CreateIncidentDto("fez-584",22.5, 20.3);

      // Run end-to-end test
      const res = await supertest.agent(app.getHttpServer())
        .post('/incident')
        .send(incidentBody)
        .set('Accept', 'application/json')
        .expect('Content-Type', /text\/html/)
        .expect(201);

      expect(JSON.parse(res.text)).toEqual('OK');
    });
  });

});
