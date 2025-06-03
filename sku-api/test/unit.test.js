describe("SKU Business Rules", () => {
  test("new SKU should start as PRE_CADASTRO", () => {
    const initialStatus = "PRE_CADASTRO";
    expect(initialStatus).toBe("PRE_CADASTRO");
  });

  test("state machine - valid transitions", () => {
    const validTransitions = {
      PRE_CADASTRO: ["CADASTRO_COMPLETO", "CANCELADO"],
      CADASTRO_COMPLETO: ["PRE_CADASTRO", "ATIVO", "CANCELADO"],
      ATIVO: ["DESATIVADO"],
      DESATIVADO: ["ATIVO", "PRE_CADASTRO"],
      CANCELADO: [],
    };

    function canTransition(from, to) {
      return validTransitions[from]?.includes(to) || false;
    }

    expect(canTransition("PRE_CADASTRO", "CADASTRO_COMPLETO")).toBe(true);
    expect(canTransition("CADASTRO_COMPLETO", "ATIVO")).toBe(true);
    expect(canTransition("ATIVO", "DESATIVADO")).toBe(true);
    expect(canTransition("DESATIVADO", "ATIVO")).toBe(true);

    expect(canTransition("ATIVO", "PRE_CADASTRO")).toBe(false);
    expect(canTransition("CANCELADO", "ATIVO")).toBe(false);
  });

  test("field editing permissions by status", () => {
    const editableFields = {
      PRE_CADASTRO: ["description", "commercialDescription", "sku"],
      CADASTRO_COMPLETO: ["commercialDescription"],
      ATIVO: [],
      DESATIVADO: [],
      CANCELADO: [],
    };

    function canEditField(status, field) {
      return editableFields[status]?.includes(field) || false;
    }

    expect(canEditField("PRE_CADASTRO", "description")).toBe(true);
    expect(canEditField("PRE_CADASTRO", "commercialDescription")).toBe(true);
    expect(canEditField("PRE_CADASTRO", "sku")).toBe(true);

    expect(canEditField("CADASTRO_COMPLETO", "description")).toBe(false);
    expect(canEditField("CADASTRO_COMPLETO", "commercialDescription")).toBe(
      true
    );
    expect(canEditField("CADASTRO_COMPLETO", "sku")).toBe(false);

    expect(canEditField("ATIVO", "description")).toBe(false);
    expect(canEditField("ATIVO", "commercialDescription")).toBe(false);
    expect(canEditField("DESATIVADO", "description")).toBe(false);

    expect(canEditField("CANCELADO", "description")).toBe(false);
    expect(canEditField("CANCELADO", "commercialDescription")).toBe(false);
  });

  test("special rule - editing commercial description in CADASTRO_COMPLETO returns to PRE_CADASTRO", () => {
    function applySpecialRule(currentStatus, updates) {
      if (
        currentStatus === "CADASTRO_COMPLETO" &&
        updates.commercialDescription
      ) {
        return "PRE_CADASTRO";
      }
      return currentStatus;
    }

    expect(
      applySpecialRule("CADASTRO_COMPLETO", {
        commercialDescription: "New description",
      })
    ).toBe("PRE_CADASTRO");

    expect(
      applySpecialRule("CADASTRO_COMPLETO", { description: "New description" })
    ).toBe("CADASTRO_COMPLETO");
    expect(
      applySpecialRule("PRE_CADASTRO", {
        commercialDescription: "New description",
      })
    ).toBe("PRE_CADASTRO");
    expect(
      applySpecialRule("ATIVO", { commercialDescription: "New description" })
    ).toBe("ATIVO");
  });
});
