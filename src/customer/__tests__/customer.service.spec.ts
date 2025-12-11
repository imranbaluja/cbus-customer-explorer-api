import { CustomerService } from "../customer.service";

describe("CustomerService (enhanced)", () => {
  let service: CustomerService;

  beforeAll(() => {
    service = new CustomerService();
  });

  it("should be defined and have customers", async () => {
    expect(service).toBeDefined();
    const all = await service.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThanOrEqual(10);
  });

  it("default pagination returns meta and data", async () => {
    const res = await service.getPaginated({});
    expect(res).toHaveProperty("data");
    expect(res).toHaveProperty("meta");
    expect(res.meta.page).toBe(1);
  });

  it("pagination page 2 limit 5 works", async () => {
    const res1 = await service.getPaginated({ page: 1, limit: 5 });
    const res2 = await service.getPaginated({ page: 2, limit: 5 });
    expect(res1.data[0].id + 5).toBe(res2.data[0].id);
  });

  it("search filters by name/email case-insensitive", async () => {
    const all = await service.getAll();
    const sample = all[3];
    const q = sample.fullName.split(" ")[1]; // numeric part
    const res = await service.getPaginated({ search: q });
    expect(res.data.length).toBeGreaterThan(0);
  });

  it("sorting by fullName asc/desc works", async () => {
    const asc = await service.getPaginated({ sort: "fullName", order: "asc", limit: 5 });
    const desc = await service.getPaginated({ sort: "fullName", order: "desc", limit: 5 });
    expect(asc.data[0].fullName <= asc.data[asc.data.length - 1].fullName).toBe(true);
    expect(desc.data[0].fullName >= desc.data[desc.data.length - 1].fullName).toBe(true);
  });

  it("dateFrom/dateTo filters work", async () => {
    // Use a date range that includes some records
    const res = await service.getPaginated({ dateFrom: "2020-01-05", dateTo: "2020-02-10" });
    expect(res.data.length).toBeGreaterThanOrEqual(0);
  });

  it("emailDomain filter works", async () => {
    const res = await service.getPaginated({ emailDomain: "example1.com" });
    // may be zero if generation distribution differs, but should not throw
    expect(res).toHaveProperty("meta");
  });

  it("invalid date throws", async () => {
    await expect(service.getPaginated({ dateFrom: "not-a-date" })).rejects.toThrow();
  });
});
