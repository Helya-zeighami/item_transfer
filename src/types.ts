export type ItemType = {
    uniqueId: number;
    date: string;
};

export type Item = {
    id: string;
    title: string;
    created: string;
    uniqueId: number;
};
export type GroupType = {
    id: string;
    quantity: number;
    items: ItemType[];
};
