import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<Omit<User, "password">>;
    updateProfile(req: any, updateData: any): Promise<Omit<User, "password">>;
}
