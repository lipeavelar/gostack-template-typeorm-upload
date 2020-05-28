import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface TrasactionRequest {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute(
    newTransaction: TrasactionRequest,
  ): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (newTransaction.type === 'outcome' && total < newTransaction.value)
      throw new AppError("The outcome can't overcome total balance");

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: newTransaction.category,
      },
    });

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: newTransaction.category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const { title, type, value } = newTransaction;

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category: transactionCategory,
    });
    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
