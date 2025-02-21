"use client";

import { useItemStore } from "@/store/useSelectionStore";
import {Item} from "@/types";

export default function SelectedData() {
    const { selectedItems, removeItem, removeAll } = useItemStore();

    const groupedSelectedItems = selectedItems.reduce<Record<string, Item[]>>((acc, item) => {
        if (!acc[item.id]) acc[item.id] = [];
        acc[item.id].push(item);
        return acc;
    }, {});

    const removeGroup = (groupId: string) => {
        groupedSelectedItems[groupId].forEach((item) => removeItem(item.uniqueId));
    };

    return (
        <div className="w-1/2 p-4 bg-gray-100 rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Selected Data</h2>
                <button
                    className="px-3 py-1 bg-gray-300 rounded"
                    onClick={removeAll}
                    disabled={selectedItems.length === 0}
                >
                    Delete All
                </button>
            </div>

            {selectedItems.length === 0 ? (
                <p className="text-gray-500">No selected items</p>
            ) : (
                Object.entries(groupedSelectedItems).map(([groupId, groupItems]) => (
                    <div key={groupId}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Group {groupId}</h3>
                            <button
                                className="px-3 py-1 bg-red-500 text-white rounded"
                                onClick={() => removeGroup(groupId)}
                            >
                                Remove Entire Group
                            </button>
                        </div>
                        {groupItems.map((item) => (
                            <div
                                key={item.uniqueId}
                                className="p-3 bg-gray-200 rounded-md mb-2 flex justify-between items-center"
                            >
                                <span>{item.title} - {new Date(item.created).toLocaleDateString()}</span>
                                <button
                                    className="px-2 py-1 bg-red-400 text-white rounded"
                                    onClick={() => removeItem(item.uniqueId)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}
