import { create } from "zustand";
import { items } from "@/mocks/items";
import {Item} from "@/types";

type ItemStore = {
    items: Item[];
    selectedItems: Item[];
    addItem: (item: Item) => void;
    removeItem: (uniqueId: number) => void;
    addAll: () => void;
    removeAll: () => void;
};

export const useItemStore = create<ItemStore>((set) => ({
    items: items,
    selectedItems: [],

    addItem: (item) =>
        set((state) => ({
            selectedItems: [...state.selectedItems, item],
            items: state.items.filter((i) => i.uniqueId !== item.uniqueId),
        })),

    removeItem: (uniqueId) =>
        set((state) => {
            const itemToRemove = state.selectedItems.find((i) => i.uniqueId === uniqueId);
            if (itemToRemove) {
                return {
                    items: [...state.items, itemToRemove],
                    selectedItems: state.selectedItems.filter((i) => i.uniqueId !== uniqueId),
                };
            }
            return state;
        }),

    addAll: () =>
        set((state) => ({
            selectedItems: [...state.items],
            items: [],
        })),

    removeAll: () =>
        set((state) => ({
            items: [...state.selectedItems],
            selectedItems: [],
        })),
}));
