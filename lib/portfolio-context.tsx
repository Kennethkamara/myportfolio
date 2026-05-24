"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { PortfolioData } from "./types";
import { mockPortfolioData } from "./mock-data";

interface PortfolioContextType {
  data: PortfolioData;
  updateData: (newData: Partial<PortfolioData>) => void;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>(mockPortfolioData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedData = localStorage.getItem("portfolioData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      } catch (error) {
        console.error("Failed to parse saved data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateData = (newData: Partial<PortfolioData>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    localStorage.setItem("portfolioData", JSON.stringify(updatedData));
  };

  if (isLoading) {
    return null;
  }

  return (
    <PortfolioContext.Provider value={{ data, updateData, isLoading }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
