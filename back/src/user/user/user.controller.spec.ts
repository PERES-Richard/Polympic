import {Test} from '@nestjs/testing';
import {UserService} from './user.service';
import {UserRepository} from './user.repository';
import {INestApplication} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from './user.module';
import {ServiceApiRepository} from '../../api/service_api/service_api.repository';
import {ServiceApiModule} from '../../api/service_api/service_api.module';
import {CreateUserDto} from "./dto";
import {database_test_config} from '../../config';
import supertest = require('supertest');

describe('User Controller', () => {
    let app: INestApplication;
    let repository: UserRepository;
    let service: UserService;
    let serviceRepo: ServiceApiRepository;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                UserModule,
                ServiceApiModule,
                TypeOrmModule.forRoot(database_test_config),
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();

        serviceRepo = module.get<ServiceApiRepository>(ServiceApiRepository);
        repository = module.get<UserRepository>(UserRepository);
        service = module.get<UserService>(UserService);
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        await repository.query('DELETE FROM user WHERE 1;');
        await serviceRepo.query('DELETE FROM shared_user WHERE 1;');
        await serviceRepo.query('DELETE FROM service_api WHERE 1;');

    });

    afterEach(async () => {
        await repository.query('DELETE FROM user WHERE 1;');
        await serviceRepo.query('DELETE FROM shared_user WHERE 1;');
        await serviceRepo.query('DELETE FROM service_api WHERE 1;');

    });

    describe('POST /user', () => {
        it('should return the user added', async () => {
            //data to send
            const userBody = new CreateUserDto("test-user", 22.5, 20.3);

            // Run end-to-end test
            const res = await supertest.agent(app.getHttpServer())
                .post('/user')
                .send(userBody)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);

            expect(res.body.uuid).toBe("test-user");
            expect(res.body.latitude).toBe(22.5);
            expect(res.body.longitude).toBe(20.3);
        });
    });

    describe('GET /user/inRange', () => {
        it('should find all user in a specific range', async () => {
            //init repo
            await repository.save([
                {uuid: "test1", latitude: 21.2, longitude: 20.3, date: new Date()},
                {uuid: "test2", latitude: 22.6, longitude: 18.5, date: new Date()},
                {uuid: "test3", latitude: 28.3, longitude: 19.1, date: new Date()},
            ]);

            //date
            const data = {range: 2, latitude: 22.5, longitude: 19.2};

            // Run end-to-end test
            const res = await supertest.agent(app.getHttpServer())
                .get('/user/inRange/' + data.latitude + '/' + data.longitude + '/' + data.range)
                .send()
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body).toEqual([
                {uuid: "test1", latitude: 21.2, longitude: 20.3, date: expect.any(String)},
                {uuid: "test2", latitude: 22.6, longitude: 18.5, date: expect.any(String)},
            ]);
        });
    });


    describe('GET /user/inRange/quantity', () => {
        it('should return the count of the total user in a specific range', async () => {
            //init repo
            await repository.save([
                {uuid: "test1", latitude: 21.2, longitude: 20.3, date: new Date()},
                {uuid: "test2", latitude: 22.6, longitude: 18.5, date: new Date()},
                {uuid: "test3", latitude: 28.3, longitude: 19.1, date: new Date()},
            ]);

            //date
            const data = {range: 2, latitude: 22.5, longitude: 19.2};

            // Run end-to-end test
            const res = await supertest.agent(app.getHttpServer())
                .get('/user/inRange/quantity/' + data.latitude + '/' + data.longitude + '/' + data.range)
                .set('Accept', 'application/json')
                .send()
                .expect('Content-Type', /text\/html/)
                .expect(200);

            expect(res.text).toBe("2");
        });
    });

    describe('GET /user/recentUsers', () => {
        it('users must be owned by Polympic', async () => {
            await serviceRepo.save([
                {name: "testService", isExternal: true, id: 56}
            ]);

            //init repo
            await repository.save([
                {uuid: "test1", latitude: 21.2, longitude: 20.3, date: new Date()},
                {uuid: "test2", latitude: 23.6, longitude: 18.5, date: new Date()},
                {uuid: "test3", latitude: 28.3, longitude: 19.1, date: new Date()},
            ]);

            const user = await repository.findOne({uuid: "test1"});
            const service = await serviceRepo.findOne({name: "testService"});

            user.service = service;
            await user.save();

            // Run end-to-end test
            const res = await supertest.agent(app.getHttpServer())
                .get('/user/recentUsers')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body).toEqual([
                {uuid: "test2", latitude: 23.6, longitude: 18.5, date: expect.any(String), service: null},
                {uuid: "test3", latitude: 28.3, longitude: 19.1, date: expect.any(String), service: null},
            ]);
        });
    });

    describe('GET /user/recentExternalUsers', () => {
        it('users must be owned by external service', async () => {
            await serviceRepo.save([
                {name: "testService", isExternal: true, id: 56}
            ]);

            //init repo
            await repository.save([
                {uuid: "test1", latitude: 21.2, longitude: 20.3, date: new Date()},
                {uuid: "test2", latitude: 23.6, longitude: 18.5, date: new Date()},
                {uuid: "test3", latitude: 28.3, longitude: 19.1, date: new Date()},
            ]);

            const user = await repository.findOne({uuid: "test1"});
            const service = await serviceRepo.findOne({name: "testService"});

            user.service = service;
            await user.save();

            // Run end-to-end test
            const res = await supertest.agent(app.getHttpServer())
                .get('/user/recentExternalUsers')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body).toEqual([
                {uuid: "test1", latitude: 21.2, longitude: 20.3, date: expect.any(String), service: service}
            ]);
        });
    });
});
