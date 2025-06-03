const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());

describe("SKU API Integration Tests", () => {
  test("should setup test environment", () => {
    expect(app).toBeDefined();
  });
});

describe("SKU Business Rules Integration", () => {
  let skuId;
  const baseUrl = "http://localhost:3001";

  beforeAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  test("should create SKU with initial PRE_CADASTRO status", async () => {
    const response = await fetch(`${baseUrl}/api/skus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: "Test Integration SKU",
        commercialDescription: "Test Commercial",
        sku: `INT-TEST-${Date.now()}`,
      }),
    });

    expect(response.status).toBe(201);
    const { data: sku } = await response.json();

    expect(sku.status).toBe("PRE_CADASTRO");
    expect(sku.description).toBe("Test Integration SKU");
    skuId = sku.id;
  });

  test("should transition from PRE_CADASTRO to CADASTRO_COMPLETO", async () => {
    if (!skuId) {
      throw new Error("Need SKU ID from previous test");
    }

    const response = await fetch(`${baseUrl}/api/skus/${skuId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CADASTRO_COMPLETO" }),
    });

    expect(response.status).toBe(200);
    const { data: sku } = await response.json();

    expect(sku.status).toBe("CADASTRO_COMPLETO");
  });

  test("should apply special rule: editing commercialDescription in CADASTRO_COMPLETO returns to PRE_CADASTRO", async () => {
    if (!skuId) {
      throw new Error("Need SKU ID from previous test");
    }

    await fetch(`${baseUrl}/api/skus/${skuId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CADASTRO_COMPLETO" }),
    });

    const response = await fetch(`${baseUrl}/api/skus/${skuId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commercialDescription: "Updated Commercial Description",
      }),
    });

    expect(response.status).toBe(200);
    const { data: sku } = await response.json();

    expect(sku.commercialDescription).toBe("Updated Commercial Description");
    expect(sku.status).toBe("PRE_CADASTRO");
  });
});
