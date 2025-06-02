import { SKUStatus } from '../models/SKU';

export const STATE_TRANSITIONS: Record<SKUStatus, SKUStatus[]> = {
  [SKUStatus.PRE_CADASTRO]: [SKUStatus.CADASTRO_COMPLETO, SKUStatus.CANCELADO],
  [SKUStatus.CADASTRO_COMPLETO]: [SKUStatus.PRE_CADASTRO, SKUStatus.ATIVO, SKUStatus.CANCELADO],
  [SKUStatus.ATIVO]: [SKUStatus.DESATIVADO],
  [SKUStatus.DESATIVADO]: [SKUStatus.ATIVO, SKUStatus.PRE_CADASTRO],
  [SKUStatus.CANCELADO]: []
};

export const EDITABLE_FIELDS: Record<SKUStatus, string[]> = {
  [SKUStatus.PRE_CADASTRO]: ['description', 'commercialDescription', 'sku'],
  [SKUStatus.CADASTRO_COMPLETO]: ['commercialDescription'],
  [SKUStatus.ATIVO]: [],
  [SKUStatus.DESATIVADO]: [],
  [SKUStatus.CANCELADO]: []
};

export class SKUStateMachine {
  static canTransition(from: SKUStatus, to: SKUStatus): boolean {
    return STATE_TRANSITIONS[from].includes(to);
  }

  static getValidTransitions(status: SKUStatus): SKUStatus[] {
    return STATE_TRANSITIONS[status];
  }

  static canEditField(status: SKUStatus, field: string): boolean {
    return EDITABLE_FIELDS[status].includes(field);
  }

  static getEditableFields(status: SKUStatus): string[] {
    return EDITABLE_FIELDS[status];
  }

  static validateUpdate(currentStatus: SKUStatus, updates: any): string[] {
    const errors: string[] = [];

    if (updates.status && !this.canTransition(currentStatus, updates.status)) {
      errors.push(`Cannot transition from ${currentStatus} to ${updates.status}`);
    }

    const editableFields = this.getEditableFields(currentStatus);
    Object.keys(updates).forEach(field => {
      if (field !== 'status' && !this.canEditField(currentStatus, field)) {
        errors.push(`Field '${field}' cannot be edited in status ${currentStatus}`);
      }
    });

    return errors;
  }
}