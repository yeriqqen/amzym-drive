import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, createOrderData: {
        items: number[];
        totalAmount: number;
    }): Promise<any>;
    findAll(req: any): Promise<any>;
    findOne(id: string): Promise<any>;
    updateStatus(id: string, status: string): Promise<any>;
}
