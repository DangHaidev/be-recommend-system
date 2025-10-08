import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    Put,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UsersController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        await this.userService.create(createUserDto);
        return { message: 'User created successfully' };
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
    ): Promise<User[]> {
        return this.userService.findAll(page, pageSize);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.userService.findOne(+id);
        return {
            success: true,
            user,
            message: 'User read successfully',
        };
    }
    @Put(':id')
    update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<User> {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.userService.remove(+id);
        return {
            success: true,
            message: 'User deleted successfully',
        };
    }
}
