import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class AccountDetails {
    @PrimaryGeneratedColumn()
    accountNumber: number;

    @Column()
    userId: number;

    @Column()
    openingBalance: number;

    @Column()
    currentBalance: number;

    @Column()
    type: string;

    @Column()
    status: number;

    @CreateDateColumn()
    createDateTime: string;

    @UpdateDateColumn()
    recordUpdateTime: string;

    @Column({
        type: 'enum',
        enum: ['user', 'master'],
        default: 'user'
    })
    userType: string;
}