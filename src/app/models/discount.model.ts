export interface Discount {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
  }
  