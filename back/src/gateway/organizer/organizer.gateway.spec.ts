import { Test } from '@nestjs/testing';
import { OrganizerGateway } from './organizer.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserRepository} from '../../user/user/user.repository';
import { UserGateway } from '../user/user.gateway';
import { INestApplication } from '@nestjs/common';
import { UserModule } from '../../user/user/user.module';
import { ServiceApiModule } from '../../api/service_api/service_api.module';
import { database_test_config } from '../../config';

describe('OrganizerGateway', () => {
  let gateway: OrganizerGateway;
  const address = 'ws://localhost:3001/organizer';
  const userAddress = 'ws://localhost:3001/user';
  let userRepository: UserRepository;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(database_test_config),
        UserModule,
        ServiceApiModule,
      ],
      providers: [UserGateway, OrganizerGateway],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    gateway = new OrganizerGateway();
    userRepository = module.get<UserRepository>(UserRepository);
  });

  beforeEach(async () => {
    await userRepository.query('DELETE FROM user WHERE 1;');
  });

  afterEach(async () => {
    await userRepository.query('DELETE FROM user WHERE 1;');
  });

  afterAll(async () => {
    await app.close();
  });

  it('I can connect to the socket server', (done) => {
    const wsClient = require('socket.io-client')(address);
    wsClient.on('connect', () => {
      wsClient.disconnect(true);
      done();
    });
  });

  it('When a user send his coordinates I receive them', (done) => {
    const wsUser = require('socket.io-client')(userAddress);
    wsUser.on('connect', () => {
      wsUser.emit('sendCoordinates', {
        uuid: 'fezf-548-dfsf',
        latitude: 50,
        longitude: 60,
      });
    });
    const wsClient = require('socket.io-client')(address);
    wsClient.on('connect', () => {
      wsClient.on('receiveCoordinates', (msg) => {
        const parse = JSON.parse(msg);
        expect(parse.uuid).toBe("fezf-548-dfsf");
        wsClient.disconnect(true);
        wsUser.disconnect(true);
        done();
      });
    });
  });

  it('When a user is deconected I can get his uuid', (done) => {
    const wsUser = require('socket.io-client')(userAddress);
    const wsOrganizer = require('socket.io-client')(address);
    wsOrganizer.on('connect', () => {
      wsOrganizer.on('removeCoordinates', (msg) => {
        let res = JSON.parse(msg);
        expect(res["uuid"]).toBe("fezf-548-dfsf");
        wsOrganizer.disconnect(true);
        done();
      });
    });
    wsUser.on('connect', () => {
      wsUser.emit('sendCoordinates', {
        uuid: 'fezf-548-dfsf',
        latitude: 50,
        longitude: 60,
      });
      wsUser.disconnect(true);
    });
  });
});
