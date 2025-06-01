export interface User {
    chatId: number;
    timePeriod: number;
    cars: Array<{
        make: string;
        model: string;
    }>;
}