import { Interest } from "@app/interest";

const interestRates: Array<Interest & { id: number }> = [
  { id: 1, minMonth: 0, maxMonth: 6, minAmount: 0, maxAmount: 1000, rate: 0.1 },
  {
    id: 2,
    minMonth: 0,
    maxMonth: 6,
    minAmount: 1000,
    maxAmount: 10000,
    rate: 0.08,
  },
  {
    id: 3,
    minMonth: 0,
    maxMonth: 6,
    minAmount: 10000,
    maxAmount: 50000,
    rate: 0.06,
  },
  {
    id: 4,
    minMonth: 6,
    maxMonth: 12,
    minAmount: 0,
    maxAmount: 1000,
    rate: 0.12,
  },
  {
    id: 5,
    minMonth: 6,
    maxMonth: 12,
    minAmount: 1000,
    maxAmount: 10000,
    rate: 0.1,
  },
  {
    id: 6,
    minMonth: 6,
    maxMonth: 12,
    minAmount: 10000,
    maxAmount: 50000,
    rate: 0.08,
  },
  {
    id: 7,
    minMonth: 12,
    maxMonth: 24,
    minAmount: 0,
    maxAmount: 1000,
    rate: 0.15,
  },
  {
    id: 8,
    minMonth: 12,
    maxMonth: 24,
    minAmount: 1000,
    maxAmount: 10000,
    rate: 0.12,
  },
  {
    id: 9,
    minMonth: 12,
    maxMonth: 24,
    minAmount: 10000,
    maxAmount: 50000,
    rate: 0.1,
  },
  {
    id: 10,
    minMonth: 24,
    maxMonth: 36,
    minAmount: 0,
    maxAmount: 1000,
    rate: 0.2,
  },
  {
    id: 11,
    minMonth: 24,
    maxMonth: 36,
    minAmount: 1000,
    maxAmount: 10000,
    rate: 0.15,
  },
  {
    id: 12,
    minMonth: 24,
    maxMonth: 36,
    minAmount: 10000,
    maxAmount: 50000,
    rate: 0.12,
  },
  {
    id: 13,
    minMonth: 36,
    maxMonth: 48,
    minAmount: 0,
    maxAmount: 1000,
    rate: 0.25,
  },
  {
    id: 14,
    minMonth: 36,
    maxMonth: 48,
    minAmount: 1000,
    maxAmount: 10000,
    rate: 0.2,
  },
  {
    id: 15,
    minMonth: 36,
    maxMonth: 48,
    minAmount: 10000,
    maxAmount: 50000,
    rate: 0.15,
  },
  {
    id: 16,
    minMonth: 48,
    maxMonth: 60,
    minAmount: 0,
    maxAmount: 1000,
    rate: 0.3,
  },
  {
    id: 17,
    minMonth: 48,
    maxMonth: 60,
    minAmount: 1000,
    maxAmount: 10000,
    rate: 0.25,
  },
  {
    id: 18,
    minMonth: 48,
    maxMonth: 60,
    minAmount: 10000,
    maxAmount: 50000,
    rate: 0.2,
  },
];

export { interestRates };
