"use client";
import { useState, useEffect } from "react";
import { useItemStore } from "@/store/useSelectionStore";
import { Item } from "@/types";

export default function AllData() {
  const { items, addItem } = useItemStore();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedGroups, setSelectedGroups] = useState<Record<string, boolean>>(
    {}
  );

  const groupedItems = items.reduce<Record<string, Item[]>>((acc, item) => {
    const groupId = String(item.id);
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(item);
    return acc;
  }, {});

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const updatedSelection = new Set(prev);
      const stringItemId = String(itemId);
      if (updatedSelection.has(stringItemId)) {
        updatedSelection.delete(stringItemId);
      } else {
        updatedSelection.add(stringItemId);
      }
      return updatedSelection;
    });
  };

  const toggleGroupSelection = (groupId: string) => {
    const newSelection = !selectedGroups[groupId];
    setSelectedGroups((prev) => ({
      ...prev,
      [groupId]: newSelection,
    }));

    const groupItems = groupedItems[groupId];
    const updatedSelection = new Set(selectedItems);
    if (newSelection) {
      groupItems.forEach((item) => updatedSelection.add(String(item.uniqueId)));
    } else {
      groupItems.forEach((item) =>
        updatedSelection.delete(String(item.uniqueId))
      );
    }

    setSelectedItems(updatedSelection);
  };

  const addSelectedItems = () => {
    selectedItems.forEach((itemId) => {
      const item = items.find((item) => item.uniqueId === Number(itemId));
      if (item) {
        addItem(item);
      }
    });
    setSelectedItems(new Set());
    updateSelectedGroups();
  };

  const updateSelectedGroups = () => {
    setSelectedGroups(() => {
      const updatedGroups: Record<string, boolean> = {};

      Object.keys(groupedItems).forEach((groupId) => {
        const groupItems = groupedItems[groupId];
        updatedGroups[groupId] = groupItems.every((item) =>
          selectedItems.has(String(item.uniqueId))
        );
      });

      return updatedGroups;
    });
  };

  useEffect(() => {
    updateSelectedGroups();
  }, [selectedItems]);

  return (
    <div className="w-1/2 p-4 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">All Data</h2>
        <button
          className={`px-3 py-1  ${
            selectedItems.size === 0 ? "bg-gray-300" : "bg-blue-500"
          } text-white rounded`}
          onClick={addSelectedItems}
          disabled={selectedItems.size === 0}
        >
          Add Selected
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">No available items</p>
      ) : (
        Object.entries(groupedItems).map(([groupId, groupItems]) => {
          const groupIsSelected = selectedGroups[groupId] || false;

          return (
            <div
              key={groupId}
              className="mb-4 border border-gray-300 rounded-md"
            >
              <div
                className="p-3 bg-gray-200 cursor-pointer flex justify-between items-center"
                onClick={() => toggleGroup(groupId)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={groupIsSelected}
                    onChange={() => toggleGroupSelection(groupId)}
                    className="mr-2"
                  />
                  <span className="font-semibold">
                    Group {groupId} ({groupItems.length})
                  </span>
                </div>
                <span>{expandedGroups[groupId] ? "▲" : "▼"}</span>
              </div>

              {expandedGroups[groupId] && (
                <div className="p-3">
                  {groupItems.map((item) => {
                    const stringItemId = String(item.uniqueId);
                    return (
                      <div
                        key={stringItemId}
                        className="p-2 bg-gray-100 rounded-md mb-2 flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(stringItemId)}
                            onChange={() => toggleItemSelection(stringItemId)}
                            className="mr-2"
                          />
                          <span>
                            {item.title} -{" "}
                            {new Date(item.created).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
