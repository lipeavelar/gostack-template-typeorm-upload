import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    transactions.forEach(transaction => {
      balance[transaction.type] += Number(transaction.value);
    });
    balance.total = Number(balance.income - balance.outcome);

    return balance;
  }
}

export default TransactionsRepository;
