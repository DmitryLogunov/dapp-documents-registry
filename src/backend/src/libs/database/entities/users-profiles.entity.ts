import {Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, UpdateDateColumn} from 'typeorm';
import {ApiEntity,ApiColumn} from "@/libs/database/decorators";
import {UsersEntity} from "@/libs/database/entities/users.entity";

@ApiEntity({
  table: "users_profiles",
  methods: {
    getCollection: "Получить профиль пользователя",
    getOne: "Получить профиль пользователя по ID",
    create: "Создать профиль пользователя",
    update: "Обновить профиль пользователя",
    delete: "Удалить профиль пользователя"
  }
})
export class UsersProfilesEntity {
  @PrimaryGeneratedColumn()
  @ApiColumn({
    isPrimary: true,
    name: 'id',
    type: 'number',
    description: 'ID профиля пользователя',
    required: false,
    example: 10
  })
  public id: number;

  @Column({
    name: 'fullName',
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  @ApiColumn({
    name: 'fullName',
    type: 'string',
    description: 'Полное имя пользователя',
    required: false,
    example: 'Сергей Кузнецов'
  })
  public fullName: string;

  @Column({
    name: 'mobilePhone',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  @ApiColumn({
    name: 'mobilePhone',
    type: 'string',
    description: 'Мобильный телефон',
    required: false,
    example: '+7 915 253-46-12'
  })
  public mobilePhone: string;

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

  @OneToOne(() => UsersEntity, user => user.profile, { cascade: true })
  @JoinColumn({name: 'userId', referencedColumnName: 'id'})
  @ApiColumn({
    name: 'users',
    isRelation: true,
    methods: {
      getCollection: "Получить привязку пользоателя к профилю (ID пользователя)",
      update: "Обновить/установить привязку пользоателя к профилю (привязать профиль к пользователю)",
      delete: "Удалить привязку пользователю к профилю (удалить профиль у пользователя)"
    }
  })
  public user: UsersEntity;
}
