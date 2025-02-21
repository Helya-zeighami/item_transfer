"use client";

import { useState } from "react";
import { useItemStore } from "@/store/useSelectionStore";
import {Item} from "@/types";

export default function AllData() {
    const { items, addItem, addAll, selectedItems } = useItemStore();
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
    const [selectedGroups, setSelectedGroups] = useState<Record<string, boolean>>({});

    const groupedItems = items.reduce<Record<string, Item[]>>((acc, item) => {
        if (!acc[item.id]) acc[item.id] = [];
        acc[item.id].push(item);
        return acc;
    }, {});

    const toggleGroup = (groupId: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupId]: !prev[groupId],
        }));
    };

    const toggleSelectAll = (groupId: string) => {
        const newSelection = !selectedGroups[groupId];
        setSelectedGroups((prev) => ({
            ...prev,
            [groupId]: newSelection,
        }));

        const groupItems = groupedItems[groupId];
        if (newSelection) {
            groupItems.forEach(item => addItem(item));
        }
    };

    return (
        <div className="w-1/2 p-4 bg-white rounded-md shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">All Data</h2>
                <button
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={addAll}
                    disabled={items.length === 0}
                >
                    Select All
                </button>
            </div>

            {items.length === 0 ? (
                <p className="text-gray-500">No available items</p>
            ) : (
                Object.entries(groupedItems).map(([groupId, groupItems]) => (
                    <div key={groupId} className="mb-4 border border-gray-300 rounded-md">
                        <div
                            className="p-3 bg-gray-200 cursor-pointer flex justify-between items-center"
                            onClick={() => toggleGroup(groupId)}
                        >
                            <span className="font-semibold">Group {groupId} ({groupItems.length})</span>
                            <button
                                className="px-3 py-1 bg-yellow-500 text-white rounded mb-2"
                                onClick={() => toggleSelectAll(groupId)}
                            >
                                {selectedGroups[groupId] ? "Select All" : "Select All"}
                            </button>
                            <span>{expandedGroups[groupId] ? "▲" : "▼"}</span>

                        </div>

                        {expandedGroups[groupId] && (
                            <div className="p-3">

                                {groupItems.map((item) => (
                                    <div
                                        key={item.uniqueId}
                                        className="p-2 bg-gray-100 rounded-md mb-2 flex justify-between items-center"
                                    >
                                        <span>{item.title} - {new Date(item.created).toLocaleDateString()}</span>
                                        <button
                                            className="px-2 py-1 bg-green-500 text-white rounded"
                                            onClick={() => addItem(item)}
                                        >
                                            Select
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
