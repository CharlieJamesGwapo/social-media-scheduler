"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setDarkMode(savedTheme === "dark");
    applyTheme(savedTheme === "dark");
  }, []);

  const applyTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    applyTheme(newDarkMode);
  };

  if (!mounted) {
    return (
      <>
        <Navbar darkMode={false} onToggleDarkMode={toggleDarkMode} />
        <main className="flex-1">{children}</main>
      </>
    );
  }

  return (
    <>
      <Navbar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      <main className="flex-1">{children}</main>
    </>
  );
}
