import { BaseEntity } from '@app/common';

interface Interest {
  minMonth: number;
  maxMonth: number;
  minAmount: number;
  maxAmount: number;
  rate: number;
}

interface InterestModel extends Interest, BaseEntity {}

export { Interest, InterestModel };
