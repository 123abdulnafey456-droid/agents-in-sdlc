import request from 'supertest';
import app from '../../src/index';

describe('API Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/api/unknown-route')
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });
});

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should require valid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should require password at least 6 characters', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: 'short',
          firstName: 'John',
          lastName: 'Doe',
        })
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });
});
