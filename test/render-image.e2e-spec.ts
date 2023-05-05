import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

describe('RendererController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return an image that matches the snapshot', async () => {
    const response = await request(app.getHttpServer())
      .get('/renderer?uid=gunther.revollo&topic=birthday&title=Happy%20Birthday&subtitle=We%20wish%20you%20a%20happy%20birthday&name=Gunther%20Revollo&date=May%205th%202023')
      .expect(200);
    const imageBuffer = await response.body;
    expect(imageBuffer).toMatchImageSnapshot({
      comparisonMethod: 'ssim',
      failureThreshold: 0.01,
      failureThresholdType: 'percent'
    })
  });
});
