import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { ItemsService } from '../items/items.service';
import { ListItem } from '../list-item/entities/list-item.entity';
import { List } from '../lists/entities/list.entity';
import { ListsService } from '../lists/lists.service';
import { ListItemService } from '../list-item/list-item.service';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(ListItem)
    private readonly lisItemsRepository: Repository<ListItem>,

    @InjectRepository(List)
    private readonly listsRepository: Repository<List>,

    private readonly usersService: UsersService,

    private readonly itemsService: ItemsService,

    private readonly listsService: ListsService,

    private readonly listItemsService: ListItemService,
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

    // create items
    await this.loadItems(users);

    // create lists
    const lists = await this.loadLists(users);

    // create list items for one user
    const items = await this.itemsService.findAll(
      users[0],
      { limit: 15, offset: 0 },
      {},
    );
    const listUser = await this.listsService.findAll(
      users[0],
      { limit: 1, offset: 0 },
      {},
    );
    await this.loadListItems(listUser[0], items);

    return true;
  }

  async deleteDatabase() {
    // delete list items
    await this.lisItemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // delete lists
    await this.listsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
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

  async loadLists(users: User[]): Promise<List[]> {
    const listsPromises: Promise<List>[] = [];
    for (const list of SEED_LISTS) {
      const randomIndex = Math.floor(Math.random() * users.length);

      listsPromises.push(this.listsService.create(list, users[randomIndex]));
    }

    const lists = await Promise.all(listsPromises);

    return lists;
  }

  async loadListItems(list: List, items: Item[]) {
    for (const item of items) {
      await this.listItemsService.create({
        quantity: Math.floor(Math.random() * 10),
        completed: Math.random() > 0.5,
        listId: list.id,
        itemId: item.id,
      });
    }
  }
}
