import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class TransactionDetails {
    @PrimaryGeneratedColumn()
    trasactionId   : number;

    @Column()
    fromAccountNumber: number;

    @Column()
    toAccountNumber: number;

    @Column()
    type: string;

    @Column()
    amount: number;

    @Column()
    status: string;

    @Column()
    isInstersetAdded: number;   

    @Column()
    percentageOfIntersetAdded: number;

    @Column()
    commissionAmount: number;

    @Column()
    totalAmountDedecuted: number;

    @Column()
    description: string;

    @Column()
    transactionThrough: string;

    @CreateDateColumn()
    transactionStartDate: string;

    @CreateDateColumn()
    transactionCompleteDate: string;

    @UpdateDateColumn()
    recordUpdateTime: string;
}