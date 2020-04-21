import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ExternalSecurityService} from "./external-security.service";
import {ExternalSecurityRepository} from "./external-security.repository";
import {INestApplication} from "@nestjs/common";
import {ExternalSecurityModule} from "./external-security.module";
import {CreateExternalSecurityDto} from "./dto/create-external-security.dto";
import {AnonymousIncidentModule} from "../anonymous-incident/anonymous-incident.module";
import {IncidentModule} from "../../incident/incident.module";
import {database_test_config} from '../../config';

describe('ExternalSecurity Service', () => {
  let app: INestApplication;
  let repository: ExternalSecurityRepository;
  let service: ExternalSecurityService;

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
  });

  afterAll(async (done) => {
    await app.close();
    done();
  });

  beforeEach(async () => {
    await repository.query('DELETE FROM external_security_entity WHERE 1;');
  });

  afterEach(async () => {
    await repository.query('DELETE FROM external_security_entity WHERE 1;');
  });

  describe('Add /external-security', async () => {
    it('Should return the external-security-entity added', async () => {
      const securityBody = new CreateExternalSecurityDto(22.5, 20.3, "http://superSecure/polympic", "SuperSecure");
      let res = await service.addExternalSecurity(securityBody);
      expect(res.latitude).toBe(22.5);
      expect(res.longitude).toBe(20.3);
      expect(res.route).toBe("http://superSecure/polympic");
      expect(res.name).toBe("SuperSecure");

      let values = await repository.find();
      expect(values.length).toBe(1);

      const securityBody2 = new CreateExternalSecurityDto(24.5, 22.3, "http://superSecurix/polympic", "SuperSecurix");
      let res2 = await service.addExternalSecurity(securityBody2);
      expect(res2.latitude).toBe(24.5);
      expect(res2.longitude).toBe(22.3);
      expect(res2.route).toBe("http://superSecurix/polympic");
      expect(res2.name).toBe("SuperSecurix");

      let values2 = await repository.find();
      expect(values2.length).toBe(2);
    });
  });
});
