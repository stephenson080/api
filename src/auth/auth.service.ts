import { Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from 'src/models/user.entity';
import {compare} from 'bcrypt'


@Injectable()
export class AuthService {
    constructor(private usersService: UserService, private jwtTokenService: JwtService){}

    async validateUserCredentials(email: string, password: string): Promise<any> {
        const user = await this.usersService.getUserByEmail(email);
        
        if (!user){
            return null
        }

        if (!user.isActive) throw new UnauthorizedException({message: 'Sorry your Acount has been Blocked!. Please contact Support'})

        const isMatch = await compare(password, user.password)

        if (isMatch){
            const {password, ...result} = user;
            return result;
        }
        return null
    }

    async loginWithCredentials(user: User) {
        if (!user){
            throw new UnauthorizedException({message: 'Wrong username or password'})
        }
        const payload = { username: user.role, sub: user.userId, };

        return {
            access_token: this.jwtTokenService.sign(payload, {
                secret: 'SUPERBIGSECRET',
                expiresIn: '3600s'
            }),
        };
    }
}