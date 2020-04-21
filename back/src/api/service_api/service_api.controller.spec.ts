import { INestApplication } from '@nestjs/common';
import { UserRepository } from "../../user/user/user.repository";
import { ServiceApiRepository } from './service_api.repository';
import { CreateUserDto } from '../../user/user/dto';
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import supertest = require('supertest');
import { ServiceApiModule } from './service_api.module';
import {database_test_config} from '../../config';

describe('ServiceApi Controller', () => {
    let userRepository: UserRepository;
    let serviceApiRepository: ServiceApiRepository;
    let app: INestApplication;
    let serviceName = 'test-service';

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(database_test_config),
                ServiceApiModule,
            ],
            providers: [],
        }).compile();

        app = module.createNestApplication();
        await app.init();

        userRepository = module.get<UserRepository>(UserRepository);
        serviceApiRepository = module.get<ServiceApiRepository>(ServiceApiRepository);
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        await serviceApiRepository.query('DELETE FROM user WHERE 1;');
        await serviceApiRepository.query('DELETE FROM shared_user WHERE 1;');
        await serviceApiRepository.query('DELETE FROM service_api WHERE 1;');
    });

    afterEach(async () => {
        await serviceApiRepository.query('DELETE FROM user WHERE 1;');
        await serviceApiRepository.query('DELETE FROM shared_user WHERE 1;');
        await serviceApiRepository.query('DELETE FROM service_api WHERE 1;');
    });

    describe('POST /service_api/set_users', () => {
        it('set_users route add or update user\'s position, and add the service if it doesn\'t exist', async () => {
            const body = {service: serviceName, users:[]};
            body.users.push(new CreateUserDto('test-user1', 54.3, 1.3));
            body.users.push(new CreateUserDto('test-user2', 17.8, 0.7));
            body.users.push(new CreateUserDto('test-user2', 18.8, 3.7));

            const response = await supertest.agent(app.getHttpServer())
            .post('/service_api/set_users')
            .send(body)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201);
            expect(response.body[0].uuid).toBe("test-user1");
            expect(response.body[0].latitude).toBe(54.3);
            expect(response.body[0].longitude).toBe(1.3);
            expect(response.body.length).toBe(2);
        });
    });
});
