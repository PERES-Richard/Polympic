import {Test} from '@nestjs/testing';
import {UserGateway} from './user.gateway';
import {UserRepository} from '../../user/user/user.repository';
import {UserService} from '../../user/user/user.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {OrganizerGateway} from '../organizer/organizer.gateway';
import {ServiceApiService} from "../../api/service_api/service_api.service";
import {ServiceApiRepository} from "../../api/service_api/service_api.repository";
import {SharedUserRepository} from "../../user/shared_user/shared_user.repository";
import { INestApplication } from '@nestjs/common';
import { database_test_config } from '../../config';

describe('UserGateway', () => {
    let gateway: UserGateway;
    let userRepository: UserRepository;
    const address = 'ws://localhost:3001/user';
    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(database_test_config),
                TypeOrmModule.forFeature([UserRepository, ServiceApiRepository, SharedUserRepository]),
            ],
            providers: [UserService, ServiceApiService, OrganizerGateway, UserGateway],
        }).compile();

        app = module.createNestApplication();
        await app.init();

        const service = module.get<UserService>(UserService);
        gateway = new UserGateway(service, new OrganizerGateway(), module.get<ServiceApiService>(ServiceApiService));
        userRepository = module.get<UserRepository>(UserRepository);
    });

    afterAll(async(done) => {
        await app.close();
        done();
    });

    beforeEach(async () => {
        await userRepository.query('DELETE FROM user WHERE 1;');
    });

    afterEach(async () => {
        await userRepository.query('DELETE FROM user WHERE 1;');
    });

    it('I can connect to the socket server', (done) => {
        const wsClient = require('socket.io-client')(address);
        wsClient.on('connect', () => {
            wsClient.disconnect(true);
            done();
        });
    });

    it('I can send my coordinates to the socket server', (done) => {
        const wsClient = require('socket.io-client')(address);
        wsClient.on('connect', () => {
            wsClient.on('sendCoordinates', (msg) => {
                expect(msg).toBe('OK');
                wsClient.disconnect(true);
                done();
            });
            wsClient.emit('sendCoordinates', {
                uuid: 'fezf-548-dfsf',
                latitude: 50,
                longitude: 60,
            });
        });
    });

    it('I can send my false uuid to the socket server and get an error', (done) => {
        const wsClient = require('socket.io-client')(address);
        wsClient.on('connect', () => {
            wsClient.on('sendCoordinates', (msg) => {
                expect(msg).toBe('ModuleRef cannot instantiate class (Uuid is missing so User is not constructable).');
                wsClient.disconnect(true);
                done();
            });
            wsClient.emit('sendCoordinates', {
                falseUuid: 'fezf-548-dfsf',
                latitude: 50,
                longitude: 60,
            });
        });
    });

    it('I can send my false latitude to the socket server and get an error', (done) => {
        const wsClient = require('socket.io-client')(address);
        wsClient.on('connect', () => {
            wsClient.on('sendCoordinates', (msg) => {
                expect(msg).toBe('ModuleRef cannot instantiate class (Latitude is missing so User is not constructable).');
                wsClient.disconnect(true);
                done();
            });
            wsClient.emit('sendCoordinates', {
                uuid: 'fezf-548-dfsf',
                latitudeFalse: 50,
                longitude: 60,
            });
        });
    });

    it('I can send my false longitude to the socket server and get an error', (done) => {
        const wsClient = require('socket.io-client')(address);
        wsClient.on('connect', () => {
            wsClient.on('sendCoordinates', (msg) => {
                expect(msg).toBe('ModuleRef cannot instantiate class (Longitude is missing so User is not constructable).');
                wsClient.disconnect(true);
                done();
            });
            wsClient.emit('sendCoordinates', {
                uuid: 'fezf-548-dfsf',
                latitude: 50,
                longitudeFalse: 60,
            });
        });
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    it('When I am disconnected my position is removed from the database', (done) => {
        const wsClient = require('socket.io-client')(address);
        wsClient.on('connect', () => {
            wsClient.on('sendCoordinates', async (msg) => {
                expect(msg).toBe('OK');
                let result = await userRepository.getRecentUsers();
                expect(result.length).toBe(1);
                wsClient.disconnect(true);
                await sleep(500); //wait for the socket to disconnect
                let result2 = await userRepository.getRecentUsers();
                expect(result2.length).toBe(0);
                done();
            });
            wsClient.emit('sendCoordinates', {
                uuid: 'fezf-548-dfsf',
                latitude: 50,
                longitude: 60,
            });
        });

    });
});
