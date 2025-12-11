import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../../app.module";
import { CacheControlInterceptor } from "../../common/interceptors/cache-control.interceptor";

describe("CustomerController (e2e enhanced)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalInterceptors(new CacheControlInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/customers (GET) default", async () => {
    const res = await request(app.getHttpServer()).get("/customers").expect(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("meta");
    expect(res.headers["cache-control"]).toBeDefined();
  });

  it("/customers?search=Customer (GET) search", async () => {
    const res = await request(app.getHttpServer()).get("/customers?search=Customer").expect(200);
    expect(res.body.meta.page).toBe(1);
  });

  it("/customers?sort=fullName&order=desc works", async () => {
    const res = await request(app.getHttpServer()).get("/customers?sort=fullName&order=desc&limit=3").expect(200);
    expect(res.body.data.length).toBeLessThanOrEqual(3);
  });

  it("/customers?dateFrom=invalid returns 400", async () => {
    await request(app.getHttpServer()).get("/customers?dateFrom=foo").expect(400);
  });
});
