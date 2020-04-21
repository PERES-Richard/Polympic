import { Test } from '@nestjs/testing';
import { ExternalEventRepository } from './external-event.repository';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import supertest = require('supertest');
import { ExternalEventModule } from './external-event.module';
import { CreateExternalEventDto } from "./dto";
import {database_test_config} from '../../config';

describe('Event Controller', () => {
    let app: INestApplication;
    let repository: ExternalEventRepository;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ExternalEventModule,
                TypeOrmModule.forRoot(database_test_config),
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();

        repository = module.get<ExternalEventRepository>(ExternalEventRepository);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /external-event', () => {
        afterAll(async () => {
            await repository.query('DELETE FROM external_event_entity WHERE 1;');
        });

        let eventID;
        let startDate = new Date();
        let endDate = new Date();
        endDate.setMinutes(startDate.getMinutes() + 5);
        it('should return the event added', async () => {
            const eventBody = new CreateExternalEventDto("test-event","Sample Provider", "a test description", 12.5, 7.8, startDate, endDate);

            // Run end-to-end test
            const res = await supertest.agent(app.getHttpServer())
                .post('/external-event/')
                .send(eventBody)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);

            expect(res.body.title).toBe("test-event");
            expect(res.body.provider).toBe('Sample Provider');
            expect(res.body.description).toBe("a test description");
            expect(res.body.latitude).toBe(12.5);
            expect(res.body.longitude).toBe(7.8);
            eventID = res.body.id;
        });

        it('should update the event', async () => {
            const eventBody = new CreateExternalEventDto("test-event", "Sample Provider", "ANOTHER test description", 12.5, 7.8, startDate, endDate);
            const res = await supertest.agent(app.getHttpServer())
                .put('/external-event/' + eventID)
                .send(eventBody)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body.title).toBe('test-event');
            expect(res.body.provider).toBe('Sample Provider');
            expect(res.body.description).toBe(eventBody.description);
            expect(res.body.latitude).toBe(eventBody.latitude);
            expect(res.body.longitude).toBe(eventBody.longitude);
            expect(res.body.id).toBe(eventID);
        });
    });

});
