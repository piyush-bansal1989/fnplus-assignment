import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    firstName: string;

    @Column()
    middleName: string;

    @Column()
    lastName: string;

    @Column()
    city: string;

    @Column()
    email: string;

    @Column()
    mobile: string;

    @Column()
    dob: string;

    @Column()
    isActive: number;
}