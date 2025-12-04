import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly usersService: UsersService,

    private readonly itemsService: ItemsService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    // check environment
    if (this.isProd) {
      throw new UnauthorizedException('SEED can not be executed in production');
    }

    // clean database
    await this.deleteDatabase();

    // create users
    const users = await this.loadUsers();

    await this.loadItems(users);
    // create items
    return true;
  }

  async deleteDatabase() {
    // delete items
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    // detele users
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User[]> {
    const users: User[] = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users;
  }

  async loadItems(users: User[]) {
    const itemsPromises: Promise<Item>[] = [];
    for (const item of SEED_ITEMS) {
      const randomIndex = Math.floor(Math.random() * users.length);

      itemsPromises.push(this.itemsService.create(item, users[randomIndex]));
    }

    await Promise.all(itemsPromises);
  }
}
