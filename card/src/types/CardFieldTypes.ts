import { CardNetwork } from '../enums/CardNewtwork';
import { CardStatus } from '../enums/CardStatus';
import { CardType } from '../enums/CardType';

export interface User {
  id: string;
  name: string;
}

export interface Settings {
  dailyLimit: number;
  weeklyLimit: number;
  monthlyLimit: number;
}

export interface Info {
  no: string;
  network: CardNetwork;
  status: CardStatus;
  type: CardType;
  cvv: string;
  expiryDate: Date;
  issueDate: Date;

  billingAddress: string;
  maxCredit: number | undefined;
}
