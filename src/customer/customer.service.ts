import { Injectable } from "@nestjs/common";
import { Customer } from "./interfaces/customer.interface";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class CustomerService {
  private customers: Customer[] = [];
  private cache = new Map<string, { ts: number; value: any }>();
  private CACHE_TTL_MS = 60 * 1000; // 60s
  private preSorted: Record<string, Customer[]> = {};

  constructor() {
    this.loadData();
    this.buildPreSorted();
  }

  private loadData() {
    const filePath = path.join(__dirname, "..", "data", "customers.json");
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(raw) as Customer[];
        this.customers = parsed;
      } else {
        // generate synthetic data if file missing
        this.customers = this.generateCustomers(200);
      }
    } catch (err) {
      // fallback to generated data
      this.customers = this.generateCustomers(200);
    }
  }

  private generateCustomers(n: number): Customer[] {
    const arr: Customer[] = [];
    const start = new Date(2020, 0, 1);
    for (let i = 1; i <= n; i++) {
      const reg = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      arr.push({
        id: i,
        fullName: `Customer ${i}`,
        email: `customer${i}@example${(i % 10) + 1}.com`,
        registrationDate: reg.toISOString(),
      });
    }
    return arr;
  }

  private buildPreSorted() {
    // by name ascending/descending
    this.preSorted["fullName:asc"] = [...this.customers].sort((a, b) => a.fullName.localeCompare(b.fullName));
    this.preSorted["fullName:desc"] = [...this.preSorted["fullName:asc"]].reverse();

    // by registrationDate asc/desc
    this.preSorted["registrationDate:asc"] = [...this.customers].sort(
      (a, b) => new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime()
    );
    this.preSorted["registrationDate:desc"] = [...this.preSorted["registrationDate:asc"]].reverse();
  }

  private cacheGet(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > this.CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  private cacheSet(key: string, value: any) {
    this.cache.set(key, { ts: Date.now(), value });
  }

  async getPaginated(query: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: "fullName" | "registrationDate";
    order?: "asc" | "desc";
    dateFrom?: string;
    dateTo?: string;
    emailDomain?: string;
  }) {
    const { page = 1, limit = 10, search, sort, order = "asc", dateFrom, dateTo, emailDomain } = query;

    const cacheKey = JSON.stringify({ page, limit, search, sort, order, dateFrom, dateTo, emailDomain });
    const cached = this.cacheGet(cacheKey);
    if (cached) {
      return cached;
    }

    // Pick base array: if sorted requested, use preSorted array then filter; otherwise use original customers
    let working: Customer[] =
      sort && this.preSorted[`${sort}:${order}`] ? [...this.preSorted[`${sort}:${order}`]] : [...this.customers];

    // Filtering:
    if (search) {
      const s = search.toLowerCase();
      working = working.filter((c) => c.fullName.toLowerCase().includes(s) || c.email.toLowerCase().includes(s));
    }

    if (emailDomain) {
      const ed = emailDomain.toLowerCase();
      working = working.filter((c) => c.email.toLowerCase().endsWith(ed));
    }

    if (dateFrom) {
      const dFrom = new Date(dateFrom);
      if (isNaN(dFrom.getTime())) throw new Error("Invalid dateFrom");
      working = working.filter((c) => new Date(c.registrationDate) >= dFrom);
    }

    if (dateTo) {
      const dTo = new Date(dateTo);
      if (isNaN(dTo.getTime())) throw new Error("Invalid dateTo");
      working = working.filter((c) => new Date(c.registrationDate) <= dTo);
    }

    // If no sort requested, ensure deterministic order (id asc)
    if (!sort) {
      working.sort((a, b) => a.id - b.id);
    }

    const totalItems = working.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const start = (safePage - 1) * limit;
    const data = working.slice(start, start + limit);

    const result = {
      data,
      meta: {
        totalItems,
        totalPages,
        page: safePage,
        limit,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
      },
    };

    this.cacheSet(cacheKey, result);
    return result;
  }

  // Helper used in tests
  async getAll() {
    return this.customers;
  }
}
