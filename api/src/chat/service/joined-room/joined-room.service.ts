import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRoomEntity } from 'src/chat/model/joined-room/joined-room.entity';
import { JoinedRoomI } from 'src/chat/model/joined-room/joined-room.interface';
import { RoomI } from 'src/chat/model/room/room.interface';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedRoomService {
  constructor(
    @InjectRepository(JoinedRoomEntity)
    private readonly joinedRoomRepository: Repository<JoinedRoomEntity>,
  ) {}

  async create(joinedRoom: JoinedRoomI): Promise<JoinedRoomI> {
    return this.joinedRoomRepository.save(joinedRoom);
  }

  async findByUser(user: UserI): Promise<JoinedRoomI[]> {
    // See https://typeorm.io/repository-api
    // find - Finds entities that match given FindOptions
    return this.joinedRoomRepository.find({
      where: {
        user: user,
      },
    });
  }
  async findByRoom(room: RoomI): Promise<JoinedRoomI[]> {
    const _j = await this.joinedRoomRepository.find({
      where: {
        id: room.id,
      },
    });
    console.log(_j);
    return _j;
  }
  async deleteBySocketId(socketId: string) {
    return this.joinedRoomRepository.delete({ socketId: socketId });
  }
  async deleteAll() {
    await this.joinedRoomRepository.createQueryBuilder().delete().execute();
  }
}
