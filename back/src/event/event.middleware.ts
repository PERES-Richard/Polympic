import { Injectable, NestMiddleware } from "@nestjs/common";
import { EventService } from "./event.service";


@Injectable()
export class EventMiddleware implements NestMiddleware{

    constructor(private eventService: EventService){

    }

    use(req, res){
        const server = res;
        const header = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        server.writeHead(200, header);
        this.eventService.addSseConnection(server);
        req.on('close', () => {
            this.eventService.removeSseConnection(server);
        });
    }
}