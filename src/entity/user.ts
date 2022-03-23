import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { v4 } from "uuid";
import bcrypt from "bcrypt";

import Role from "./role";
import Token from "./token";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  @Unique()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Token, token => token.user)
  token: Token[];

  @Column()
  birthDate: Date;

  @Column()
  role: number;

  @Column()
  image: string;

  @Column()
  isEmailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    name: string,
    email: string,
    password: string,
    role: number = Role.User.ToInt(),
    birthDate: Date,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    image?: string,
  ) {
    this.id = v4();
    this.name = name;
    this.password = password;
    this.role = role;
    this.email = email;
    this.createdAt = createdAt,
      this.updatedAt = updatedAt,
      this.birthDate = birthDate;
    this.image = image!;
    this.isEmailVerified = false;
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  @BeforeInsert()
  @BeforeUpdate()
  formatDate() {
    this.birthDate = new Date(this.birthDate);
  }

  @BeforeInsert()
  @BeforeUpdate()
  updateImage(image: string) {
    this.image = image ? `${process.env.BACKEND_URL}/images/${image}` : `${process.env.BACKEND_URL}/images/default.png`;
  }

  getEmailIsVerified(): boolean {
    return this.isEmailVerified;
  }

  setEmailIsVerified(): void {
    this.isEmailVerified = true;
  }

  getRole(): string {
    return new Role(this.role).ToString();
  }

  setRole(code: number): void {
    this.role = new Role(code).ToInt();
  }
}
