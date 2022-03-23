import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 } from "uuid";
import { TokenType } from "../enums/token";
import User from "./user";

@Entity("tokens")
export default class Token {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  token: string;

  @ManyToOne(() => User, user => user.id, { lazy: true })
  user: User;

  @Column()
  expiresIn: string;

  @Column()
  type: string;

  @Column()
  blacklisted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    token: string,
    user: User,
    expiresIn: string,
    type: TokenType,
    blacklisted: boolean,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = v4();
    this.token = token;
    this.user = user;
    this.expiresIn = expiresIn; 
    this.type = type; 
    this.blacklisted = blacklisted; 
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}