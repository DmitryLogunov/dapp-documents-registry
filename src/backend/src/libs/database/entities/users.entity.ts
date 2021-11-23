import {
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import {ApiEntity,ApiColumn} from "@/libs/database/decorators";
import {UsersStatusTypes} from "@/libs/database/types/users-status.types";
import {UsersProfilesEntity} from "@/libs/database/entities/users-profiles.entity";


@ApiEntity({
  table: "users",
  methods: {
    getCollection: "Получить список пользователей",
    getOne: "Получить пользователя по ID",
    create: "Создать пользователя (только пользвателя; профиль пользователя, пароль, компания, роли, пермиссии и привязки к ним создаются отдельно)",
    update: "Обновить пользователя (только пользвателя; профиль пользователя и все его релэйшены обновляется отдельно)",
    delete: "Удалить пользователя (привязки к релэйшенам удалятся каскадно; также каскадно удалятся профиль пользователя и пароль)"
  }
})
export class UsersEntity {
  @PrimaryGeneratedColumn()
  @ApiColumn({
    isPrimary: true,
    name: 'id',
    type: 'number',
    description: 'ID пользователя',
    required: false,
    example: 10
  })
  id: number;

  @Column({
    name: 'accountAddress',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  @ApiColumn({
    name: 'accountAddress',
    type: 'string',
    default: 'NULL',
    description: 'Account address in blockchain',
    required: true,
    example: '0x76f6e27935d54a8175d1eaf52857ec880df7eb5c'
  })
  public accountAddress: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  @ApiColumn({
    name: 'email',
    type: 'string',
    default: 'NULL',
    description: 'Email/логин пользователя',
    required: true,
    example: 'user@email.ru'
  })
  public email: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: UsersStatusTypes,
    nullable: false
  })
  @ApiColumn({
    name: 'status',
    type: 'enum(DRAFT,INVITED,ACTIVE,BLOCKED)',
    default: 'NULL',
    description: 'Статус учётной записи пользователя',
    required: true,
    example: 'ACTIVE'
  })
  public status: UsersStatusTypes;

  @Column({
    name: 'lastActivity',
    type: 'timestamp',
    nullable: false
  })
  @ApiColumn({
    name: 'lastActivity',
    type: 'datetime',
    default: 'NULL',
    description: 'Дата время последней активности пользователя',
    required: true,
    example: '2021-06-01 13:15:00'
  })
  public lastActivity: Date;

  @Column({
    name: 'nonce',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  @ApiColumn({
    name: 'nonce',
    type: 'string',
    default: 'NULL',
    description: 'Nonce: случайная строка для аутентификации пользователя',
    required: true,
    example: 'dh8e2g2fg2232ff23ff8gr4'
  })
  public nonce: string;

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

  @OneToOne(() => UsersProfilesEntity, profile => profile.user)
  @ApiColumn({
    name: 'users-profiles',
    isRelation: true,
    methods: {
      getCollection: "Получить привязку профиля к пользоателю (ID профиля)",
      update: "Обновить/установить привязку профиля к пользоателю (привязать профиль к пользователю)",
      delete: "Удалить привязку профиля к пользоателю (удалить профиль у пользователя)"
    }
  })
  public profile: UsersProfilesEntity
}