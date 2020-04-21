import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import supertest = require('supertest');
import {AnonymousIncidentRepository} from "./anonymous-incident.repository";
import {AnonymousIncidentModule} from "./anonymous-incident.module";
import {AnonymousIncidentService} from "./anonymous-incident.service";
import {CreateAnonymousIncidentDto} from "./dto/create-incident.dto";
import { database_test_config} from '../../config';

describe('Anonymous Incident Controller', () => {
  let app: INestApplication;
  let repository: AnonymousIncidentRepository;
  let service: AnonymousIncidentService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(database_test_config),
        AnonymousIncidentModule,
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

  describe('POST /anonymous-incident', () => {
    it('should return the anonymous-incident added', async () => {
      //data to send
      const incidentBody = new CreateAnonymousIncidentDto(22.5, 20.3);

      // Run end-to-end test
      const res = await supertest.agent(app.getHttpServer())
        .post('/anonymous-incident')
        .send(incidentBody)
        .set('Accept', 'application/json')
        .expect('Content-Type', /text\/html/)
        .expect(201);

      expect(res.text).toBe('OK');
    });
  });

});
