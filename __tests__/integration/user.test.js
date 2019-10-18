import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import truncate from '../utils/truncate';

import factory from '../factories';
import User from '../../src/app/models/User';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should not be able to register without name', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send({
        email: user.email,
        password: user.email,
      });

    expect(response.status).toBe(400);
  });

  it('should not be able to register without email', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send({
        name: user.name,
        password: user.email,
      });

    expect(response.status).toBe(400);
  });

  it('should not be able to register without password', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send({
        name: user.name,
        email: user.email,
      });

    expect(response.status).toBe(400);
  });

  it('should not be able to update when not logged in', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .put('/users')
      .send({
        name: user.name,
      });

    expect(response.status).toBe(401);
  });

  // it('should be able to update name', async () => {
  //   const user = await factory.attrs('User');

  //   await request(app)
  //     .post('/users')
  //     .send(user);

  //   const { body: sessionToken } = await request(app)
  //     .post('/sessions')
  //     .send({
  //       email: user.email,
  //       password: user.password,
  //     });

  //   const response = await request(app)
  //     .put('/users')
  //     .send({
  //       name: 'Dummy',
  //       email: user.email,
  //     })
  //     .set('Authorization', `Bearer${sessionToken.token}`);

  //   console.log(response.body.name);
  //   expect(response.status).toBe(200);
  //   expect(response.body.name).toBe('Dummy');
  // });
});
