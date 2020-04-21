import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ExternalSecurityService} from "./external-security.service";
import {ExternalSecurityRepository} from "./external-security.repository";
import supertest = require('supertest');
import {INestApplication} from "@nestjs/common";
import {ExternalSecurityModule} from "./external-security.module";
import {CreateExternalSecurityDto} from "./dto/create-external-security.dto";
import {AnonymousIncidentService} from "../anonymous-incident/anonymous-incident.service";
import {CreateAnonymousIncidentDto} from "../anonymous-incident/dto/create-incident.dto";
import {AnonymousIncidentModule} from "../anonymous-incident/anonymous-incident.module";
import {IncidentModule} from "../../incident/incident.module";
import {IncidentService} from "../../incident/incident.service";
import {CreateIncidentDto} from "../../incident/dto/create-incident.dto";
import {database_test_config} from '../../config';

describe('ExternalSecurity Controller', () => {
  let app: INestApplication;
  let repository: ExternalSecurityRepository;
  let service: ExternalSecurityService;
  let anonymousService: AnonymousIncidentService;
  let incidentService: IncidentService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ExternalSecurityModule, AnonymousIncidentModule, IncidentModule,
        TypeOrmModule.forRoot(database_test_config),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    repository = module.get<ExternalSecurityRepository>(ExternalSecurityRepository);
    service = module.get<ExternalSecurityService>(ExternalSecurityService);
    anonymousService = module.get<AnonymousIncidentService>(AnonymousIncidentService);
    incidentService = module.get<IncidentService>(IncidentService);
  });

  afterAll(async (done) => {
    await app.close();
    done();
  });

  beforeEach(async () => {
    await repository.query('DELETE FROM external_security_entity WHERE 1;');
  });

  describe('POST /external-security', async () => {

    afterEach(async () => {
      await repository.query('DELETE FROM external_security_entity WHERE 1;');
    });

    it('Should return the external-security-entity added', async () => {
      //data to send
      const securityBody = new CreateExternalSecurityDto(22.5, 20.3, "http://superSecure/polympic", "SuperSecure");

      // Run end-to-end test
      const res = await supertest.agent(app.getHttpServer())
        .post('/external-security')
        .send(securityBody)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body.latitude).toBe(22.5);
      expect(res.body.longitude).toBe(20.3);
      expect(res.body.route).toBe("http://superSecure/polympic");
      expect(res.body.id).toEqual(expect.any(Number));
      expect(res.body.dateAdded).toEqual(expect.any(String));
    });

    it('An anonymous incident is sent to every security agent', async (done) => {
      await repository.query('INSERT INTO external_security_entity(route, latitude, longitude, dateAdded, name) VALUES("http://securitix.com/test", 50, 20, NOW(), "Securitix")');
      await repository.query('INSERT INTO external_security_entity(route, latitude, longitude, dateAdded, name) VALUES("http://suprasecura.com/test", 55, 22, NOW(), "SupraSecura")');

      let anonymousDto = new CreateAnonymousIncidentDto(50, 20);
      const res = await anonymousService.addAnonymousIncident(anonymousDto);
      expect(res.latitude).toBe(50);
      expect(res.longitude).toBe(20);
       done();
    });

    it('An incident is sent to every security agent', async (done) => {
      await repository.query('INSERT INTO external_security_entity(route, latitude, longitude, dateAdded, name) VALUES("http://securitox.com/test", 50, 20, NOW(), "Securitox")');
      await repository.query('INSERT INTO external_security_entity(route, latitude, longitude, dateAdded, name) VALUES("http://suprasecuras.com/test", 55, 22, NOW(), "SupraSecuras")');

      let dto = new CreateIncidentDto('uuid-test-5486', 50, 20);
      const res = await incidentService.addUserIncident(dto);
      expect(res.latitude).toBe(50);
      expect(res.longitude).toBe(20);
      done();
    });
  });
});