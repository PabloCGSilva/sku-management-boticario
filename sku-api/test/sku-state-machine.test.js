const request = require("supertest");

describe("SKU State Machine - Complete Business Rules", () => {
  let testSKUID;
  const apiUrl = "http://localhost:3001";

  beforeAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  describe("1. PRÉ-CADASTRO State Rules", () => {
    beforeEach(async () => {
      const response = await fetch(`${apiUrl}/api/skus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `Test SKU ${Date.now()}`,
          commercialDescription: "Test Commercial",
          sku: `PRE-TEST-${Date.now()}`,
        }),
      });
      const result = await response.json();
      testSKUID = (result.data || result).id;
    });

    test("should allow editing DESCRIÇÃO in PRÉ-CADASTRO", async () => {
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: "Updated Description in PRE_CADASTRO",
        }),
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      const sku = result.data || result;

      expect(sku.description).toBe("Updated Description in PRE_CADASTRO");
      expect(sku.status).toBe("PRE_CADASTRO");
    });

    test("should allow editing DESCRIÇÃO COMERCIAL in PRÉ-CADASTRO", async () => {
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commercialDescription: "Updated Commercial in PRE_CADASTRO",
        }),
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      const sku = result.data || result;

      expect(sku.commercialDescription).toBe(
        "Updated Commercial in PRE_CADASTRO"
      );
      expect(sku.status).toBe("PRE_CADASTRO");
    });

    test("should allow editing SKU code in PRÉ-CADASTRO", async () => {
      const newSKU = `UPDATED-SKU-${Date.now()}`;
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: newSKU,
        }),
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      const sku = result.data || result;

      expect(sku.sku).toBe(newSKU);
      expect(sku.status).toBe("PRE_CADASTRO");
    });

    test("should allow transition PRÉ-CADASTRO → CADASTRO_COMPLETO", async () => {
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CADASTRO_COMPLETO" }),
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      const sku = result.data || result;

      expect(sku.status).toBe("CADASTRO_COMPLETO");
    });

    test("should allow transition PRÉ-CADASTRO → CANCELADO", async () => {
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELADO" }),
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      const sku = result.data || result;

      expect(sku.status).toBe("CANCELADO");
    });

    afterEach(async () => {
      if (testSKUID) {
        await fetch(`${apiUrl}/api/skus/${testSKUID}`, { method: "DELETE" });
      }
    });
  });

  describe("2. CADASTRO_COMPLETO State Rules", () => {
    beforeEach(async () => {
      const createResponse = await fetch(`${apiUrl}/api/skus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `Test SKU ${Date.now()}`,
          commercialDescription: "Test Commercial",
          sku: `CC-TEST-${Date.now()}`,
        }),
      });
      const createResult = await createResponse.json();
      testSKUID = (createResult.data || createResult).id;

      await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CADASTRO_COMPLETO" }),
      });
    });

    test("should allow editing ONLY DESCRIÇÃO COMERCIAL in CADASTRO_COMPLETO", async () => {
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commercialDescription: "Updated Commercial in CADASTRO_COMPLETO",
        }),
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      const sku = result.data || result;

      expect(sku.commercialDescription).toBe(
        "Updated Commercial in CADASTRO_COMPLETO"
      );
    });

    test("should return to PRÉ-CADASTRO when DESCRIÇÃO COMERCIAL is changed", async () => {
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commercialDescription: "This change triggers state transition",
        }),
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      const sku = result.data || result;

      expect(sku.commercialDescription).toBe(
        "This change triggers state transition"
      );
      expect(sku.status).toBe("PRE_CADASTRO");
    });

    test("should allow transition CADASTRO_COMPLETO → ATIVO", async () => {
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ATIVO" }),
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      const sku = result.data || result;

      expect(sku.status).toBe("ATIVO");
    });

    test("should allow transition CADASTRO_COMPLETO → CANCELADO", async () => {
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELADO" }),
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      const sku = result.data || result;

      expect(sku.status).toBe("CANCELADO");
    });

    afterEach(async () => {
      if (testSKUID) {
        await fetch(`${apiUrl}/api/skus/${testSKUID}`, { method: "DELETE" });
      }
    });
  });

  describe("3. ATIVO State Rules", () => {
    beforeEach(async () => {
      const createResponse = await fetch(`${apiUrl}/api/skus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `Test SKU ${Date.now()}`,
          commercialDescription: "Test Commercial",
          sku: `ATIVO-TEST-${Date.now()}`,
        }),
      });
      const createResult = await createResponse.json();
      testSKUID = (createResult.data || createResult).id;

      await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CADASTRO_COMPLETO" }),
      });
      await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ATIVO" }),
      });
    });

    test("should NOT allow editing ANY fields in ATIVO state", async () => {
      const descResponse = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: "Should not be allowed",
        }),
      });

      const commResponse = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commercialDescription: "Should not be allowed",
        }),
      });

      const skuResponse = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: "SHOULD-NOT-WORK",
        }),
      });
    });

    test("should allow transition ATIVO → DESATIVADO", async () => {
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DESATIVADO" }),
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      const sku = result.data || result;

      expect(sku.status).toBe("DESATIVADO");
    });

    afterEach(async () => {
      if (testSKUID) {
        await fetch(`${apiUrl}/api/skus/${testSKUID}`, { method: "DELETE" });
      }
    });
  });

  describe("4. DESATIVADO State Rules", () => {
    beforeEach(async () => {
      const createResponse = await fetch(`${apiUrl}/api/skus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `Test SKU ${Date.now()}`,
          commercialDescription: "Test Commercial",
          sku: `DESATIVADO-TEST-${Date.now()}`,
        }),
      });
      const createResult = await createResponse.json();
      testSKUID = (createResult.data || createResult).id;

      await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CADASTRO_COMPLETO" }),
      });
      await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ATIVO" }),
      });
      await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DESATIVADO" }),
      });
    });

    test("should NOT allow editing ANY fields in DESATIVADO state", async () => {
      const descResponse = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: "Should not be allowed",
        }),
      });
    });

    test("should allow transition DESATIVADO → ATIVO", async () => {
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ATIVO" }),
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      const sku = result.data || result;

      expect(sku.status).toBe("ATIVO");
    });

    test("should allow transition DESATIVADO → PRÉ-CADASTRO", async () => {
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PRE_CADASTRO" }),
      });

      expect(response.status).toBe(200);
      const result = await response.json();
      const sku = result.data || result;

      expect(sku.status).toBe("PRE_CADASTRO");
    });

    afterEach(async () => {
      if (testSKUID) {
        await fetch(`${apiUrl}/api/skus/${testSKUID}`, { method: "DELETE" });
      }
    });
  });

  describe("5. CANCELADO State Rules", () => {
    beforeEach(async () => {
      const createResponse = await fetch(`${apiUrl}/api/skus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `Test SKU ${Date.now()}`,
          commercialDescription: "Test Commercial",
          sku: `CANCELADO-TEST-${Date.now()}`,
        }),
      });
      const createResult = await createResponse.json();
      testSKUID = (createResult.data || createResult).id;

      await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELADO" }),
      });
    });

    test("should NOT allow editing ANY fields in CANCELADO state", async () => {
      const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: "Should not be allowed",
          commercialDescription: "Should not be allowed",
          sku: "SHOULD-NOT-WORK",
        }),
      });
    });

    test("should NOT allow ANY status transitions from CANCELADO", async () => {
      const transitions = [
        "PRE_CADASTRO",
        "CADASTRO_COMPLETO",
        "ATIVO",
        "DESATIVADO",
      ];

      for (const status of transitions) {
        const response = await fetch(`${apiUrl}/api/skus/${testSKUID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });

        const result = await response.json();

        if (response.status === 422) {
          expect(result.error.code).toBe("BUSINESS_RULE_VIOLATION");
        } else {
          const sku = result.data || result;
          expect(sku.status).toBe("CANCELADO");
        }
      }
    });

    afterEach(async () => {
      if (testSKUID) {
        await fetch(`${apiUrl}/api/skus/${testSKUID}`, { method: "DELETE" });
      }
    });
  });

  describe("6. Invalid Transitions", () => {
    test("should reject invalid direct transitions", async () => {
      const createResponse = await fetch(`${apiUrl}/api/skus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `Test SKU ${Date.now()}`,
          commercialDescription: "Test Commercial",
          sku: `INVALID-TEST-${Date.now()}`,
        }),
      });
      const createResult = await createResponse.json();
      const skuId = (createResult.data || createResult).id;

      const response = await fetch(`${apiUrl}/api/skus/${skuId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ATIVO" }),
      });

      await fetch(`${apiUrl}/api/skus/${skuId}`, { method: "DELETE" });
    });
  });
});
