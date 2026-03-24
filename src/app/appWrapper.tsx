"use client";
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./globals.css";
import LayoutWrapper from "./layoutWrapper";
interface AppWrapperProps {
  children: React.ReactNode;
  variant?: "default" | "home"; // or a specific union type if you have defined variants
}
import useTabReloadListener from "@/hooks/useTabReloadListener";

import { useEffect } from "react";

export default function AppWrapper({ children, variant }: AppWrapperProps) {
  useTabReloadListener();

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === "IMG") {
        e.preventDefault();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === "IMG") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LayoutWrapper variant={variant}>{children}</LayoutWrapper>
      </PersistGate>
    </Provider>
  );
}
