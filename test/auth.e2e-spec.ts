import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { response } from 'express';

describe('Authentication Process', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const testEmail = 'testemail@email.com';
    const testEmail2 = 'testemail2@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: '12345' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(testEmail);
      });
  });

  it('handle a signup request then get the user', async () => {
    const testEmail2 = 'testemail2@gmail.com';
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail2, password: '12345' })
      .expect(201);
    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoAmI')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(testEmail2);
  });
});
