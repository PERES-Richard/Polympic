import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from './user.service';


@Injectable()
export class UserMiddleware implements NestMiddleware{

    constructor(private userService: UserService){

    }

    use(req, res){
        const server = res;
        const header = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        server.writeHead(200, header);
        this.userService.addSseConnection(server);
        req.on('close', () => {
            this.userService.removeSseConnection(server);
        });
    }
}
