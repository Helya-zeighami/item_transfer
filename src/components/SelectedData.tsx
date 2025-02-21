"use client";

import { useItemStore } from "@/store/useSelectionStore";
import { Item } from "@/types";
import { useState } from "react";

export default function SelectedData() {
    const { selectedItems, removeItem } = useItemStore();
    const [selectedGroupItems, setSelectedGroupItems] = useState<Record<string, Set<number>>>({});
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    const groupedSelectedItems = selectedItems.reduce<Record<string, Item[]>>(
        (acc, item) => {
            if (!acc[item.id]) acc[item.id] = [];
            acc[item.id].push(item);
            return acc;
        },
        {}
    );

    const handleGroupSelection = (groupId: string, isSelected: boolean) => {
        const groupItems = groupedSelectedItems[groupId];
        const newSelection = isSelected
            ? new Set(groupItems.map((item) => item.uniqueId))
            : new Set<number>();

        setSelectedGroupItems((prev) => ({
            ...prev,
            [groupId]: newSelection,
        }));
    };

    const handleItemSelection = (groupId: string, itemId: number) => {
        setSelectedGroupItems((prev) => {
            const updatedSelection = new Set(prev[groupId]);
            if (updatedSelection.has(itemId)) {
                updatedSelection.delete(itemId);
            } else {
                updatedSelection.add(itemId);
            }

            return {
                ...prev,
                [groupId]: updatedSelection,
            };
        });
    };

    const handleDelete = () => {
        Object.entries(selectedGroupItems).forEach(([groupId, selectedIds]) => {
            selectedIds.forEach((itemId) => {
                removeItem(itemId);
            });
        });
        setSelectedGroupItems({});
    };

    const handleToggleGroup = (groupId: string) => {
        setCollapsedGroups((prev) => ({
            ...prev,
            [groupId]: !prev[groupId],
        }));
    };

    const hasSelectedItems = Object.values(selectedGroupItems).some((set) => set.size > 0);

    return (
        <div className="w-1/2 p-4 rounded-md">
            <div
                className={`p-4 rounded-md mb-4 transition-opacity ${
                    hasSelectedItems ? "bg-white" : "bg-gray-200 opacity-50"
                }`}
            >
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold">Selected Data</h2>
                    <button
                        className={`px-3 py-1 rounded ${
                            hasSelectedItems ? "bg-red-500 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                        onClick={handleDelete}
                        disabled={!hasSelectedItems}
                    >
                        Delete Selected
                    </button>
                </div>
            </div>

            {Object.entries(groupedSelectedItems).map(([groupId, groupItems]) => {
                const selectedCount = selectedGroupItems[groupId]?.size || 0;
                const totalCount = groupItems.length;
                const isCollapsed = collapsedGroups[groupId];

                return (
                    <div key={groupId}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">
                                Group {groupId} ({totalCount})
                            </h3>
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleToggleGroup(groupId)}
                                    className="mr-2"
                                >
                                    {isCollapsed ? "▶" : "▼"}
                                </button>
                                <input
                                    type="checkbox"
                                    checked={selectedCount === totalCount}
                                    onChange={(e) => handleGroupSelection(groupId, e.target.checked)}
                                    className="mr-2"
                                />
                            </div>
                        </div>

                        {!isCollapsed && groupItems.map((item) => (
                            <div
                                key={item.uniqueId}
                                className="p-3 bg-gray-200 rounded-md mb-2 flex justify-between items-center"
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedGroupItems[groupId]?.has(item.uniqueId) || false}
                                        onChange={() => handleItemSelection(groupId, item.uniqueId)}
                                        className="mr-2"
                                    />
                                    <span>
                                        {item.title} - {new Date(item.created).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
