import { Test } from '@nestjs/testing';
import { EventRepository } from './event.repository';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import supertest = require('supertest');
import { EventModule } from './event.module';
import { CreateEventDto } from "./dto";
import {database_test_config} from '../config';

describe('Event Controller', () => {
    let app: INestApplication;
    let repository: EventRepository;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                EventModule,
                TypeOrmModule.forRoot(database_test_config),
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();

        repository = module.get<EventRepository>(EventRepository);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/event', () => {
        afterAll(async () => {
            await repository.query('DELETE FROM event_entity WHERE 1;');
        });

        let eventID;
        let startDate = new Date();
        let endDate = new Date();
        endDate.setMinutes(startDate.getMinutes() + 5);
        it('should return the events added', async () => {
            const eventBody = new CreateEventDto("test-event", "a test description", 12.5, 7.8, startDate, endDate);

            // Run end-to-end test
            const res = await supertest.agent(app.getHttpServer())
                .post('/event')
                .send(eventBody)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);

            expect(res.body.title).toBe("test-event");
            expect(res.body.description).toBe("a test description");
            expect(res.body.latitude).toBe(12.5);
            expect(res.body.longitude).toBe(7.8);
            eventID = res.body.id;
        });

        it('should update the event', async () => {
            const eventBody = new CreateEventDto("test-event", "ANOTHER test description", 12.5, 7.8, startDate, endDate);
            const res = await supertest.agent(app.getHttpServer())
                .put('/event/' + eventID)
                .send(eventBody)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body.title).toBe('test-event');
            expect(res.body.description).toBe(eventBody.description);
            expect(res.body.latitude).toBe(eventBody.latitude);
            expect(res.body.longitude).toBe(eventBody.longitude);
            expect(res.body.id).toBe(eventID);
        });

        it('should return specific events', async () => {
            const eventBody = new CreateEventDto("test-event", "ANOTHER test description", 12.5, 7.8, startDate, endDate);
            const res = await supertest.agent(app.getHttpServer())
                .get('/event/search/test')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body).toHaveLength(1);
            expect(res.body[0].title).toBe('test-event');
            expect(res.body[0].description).toBe(eventBody.description);
            expect(res.body[0].latitude).toBe(eventBody.latitude);
            expect(res.body[0].longitude).toBe(eventBody.longitude);
            expect(res.body[0].id).toBe(eventID);
        });

        it('should not return events', async () => {
            const res = await supertest.agent(app.getHttpServer())
                .get('/event/search/something')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(res.body).toHaveLength(0);
        });
    });

});
