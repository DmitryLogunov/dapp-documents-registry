import {Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, UpdateDateColumn} from 'typeorm';
import {UsersEntity} from "@/libs/database/entities/users.entity";
import {ApiColumn, ApiEntity} from "@/libs/database/decorators";

@ApiEntity({
  table: "passwords",
  methods: {
    create: "Создать пароль пользователя",
    update: "Обновить пароль пользователя",
    delete: "Удалить пароль пользователя"
  }
})
export class PasswordsEntity {
  @PrimaryGeneratedColumn()
  @ApiColumn({
    isPrimary: true,
    name: 'id',
    type: 'number',
    description: 'ID пароля',
    required: false,
    example: 10
  })
  public id: number;

  @Column({
    name: 'passwordHash',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  @ApiColumn({
    name: 'passwordHash',
    type: 'string',
    default: 'NULL',
    description: 'Хэш пароля пользователя',
    required: true,
    example: 'D#sdsd%e%F^&Gg&^WFS'
  })
  public passwordHash: string;

  @Column({
    name: 'createdAt',
    type: 'timestamp',
    nullable: true,
    default: 'CURRENT_TIMESTAMP'
  })
  @ApiColumn({
    name: 'createdAt',
    type: 'datetime',
    default: 'CURRENT_TIMESTAMP',
    description: 'Дата создания',
    example: '2021-01-01 14:00:00'
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
    nullable: true,
    default: 'CURRENT_TIMESTAMP'
  })
  @ApiColumn({
    name: 'updatedAt',
    type: 'datetime',
    description: 'Дата последнего обновления',
    example: '2021-08-01 11:00:00'
  })
  public updatedAt: Date;

  @OneToOne(() => UsersEntity, user => user.password)
  @JoinColumn({
    name: 'userId'
  })
  @ApiColumn({
    name: 'users',
    isRelation: true,
    methods: {
      update: "Обновить/установить пароль пользователя (привязать пользовател к паролю)",
      delete: "Удалить пароль пользователя (удалить привязку пользовател к паролю)"
    }
  })
  public user: UsersEntity;
}
