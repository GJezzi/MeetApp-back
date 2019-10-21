import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import truncate from '../utils/truncate';

import factory from '../factories';

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

  it('should not be able to register with invalid email', async () => {
    const user = await factory.attrs('User', {
      email: 'emailemail.com',
    });

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should not be able to register with password with less than 6 charactes', async () => {
    const user = await factory.attrs('User', {
      password: '12345',
    });

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  /*
  / UPDATE USER
  */

  it('should be possible to update the user name', async () => {
    const user = await factory.create('User');

    await request(app)
      .post('/users')
      .send(user);

    const { body: session } = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
      });

    const response = await request(app)
      .put('/users')
      .send({
        name: 'Dummy Name',
        password: user.password,
      })
      .set('Authorization', `Bearer ${session.token}`);

    console.log(session.token);

    expect(response.body.name).toBe('Dummy Name');
  });
});
