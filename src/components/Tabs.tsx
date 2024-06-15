import clsx from "clsx";
import React from "react";

interface TabsProps {
  tabs: { name: string; value: string }[];
  onTabChange: (idx: number) => void;
  currentIndex: number;
}

const Tabs: React.FC<TabsProps> = ({ tabs, currentIndex, onTabChange }) => {
  return (
    <div>
      <nav
        aria-label="Tabs"
        className="flex divide-x divide-gray-200 rounded-t-lg shadow isolate"
      >
        {tabs.map((tab, tabIdx) => (
          <div
            key={tab.name}
            onClick={() => onTabChange(tabIdx)}
            className={clsx(
              currentIndex === tabIdx
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700",
              "group cursor-pointer relative min-w-0 flex-1 overflow-hidden bg-white px-4 py-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10"
            )}
            aria-current={currentIndex === tabIdx ? "page" : undefined}
          >
            <span>{tab.name}</span>
            <span
              aria-hidden="true"
              className={clsx(
                currentIndex === tabIdx ? "bg-primary" : "bg-transparent",
                "absolute inset-x-0 bottom-0 h-0.5"
              )}
            />
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
