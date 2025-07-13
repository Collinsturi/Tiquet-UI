export interface EventType {
    id: number;
    name: string;
    date: string; // Using string for date as per your data, consider Date object for more complex date handling
    location: string;
    description: string;
}