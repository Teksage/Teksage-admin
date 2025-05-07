// import React, { createContext, useState, useEffect, ReactNode } from "react";

// // Define the shape of the context value
// interface ThemeContextType {
//   themeMode: "light" | "dark";
//   setThemeMode: (mode: "light" | "dark") => void;
// }

// // Create the Theme Context with a default value
// const ThemeContext = createContext<ThemeContextType>({
//   themeMode: "light",
//   setThemeMode: () => {},
// });

// // Theme Provider Component
// interface ThemeProviderWrapperProps {
//   children: ReactNode;
// }

// export const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = ({ children }) => {
//   const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

//   // Load theme preference from localStorage on mount
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("themeMode") as "light" | "dark";
//     if (savedTheme) {
//       setThemeMode(savedTheme);
//     }
//   }, []);

//   // Save theme preference to localStorage when themeMode changes
//   useEffect(() => {
//     localStorage.setItem("themeMode", themeMode);
//   }, [themeMode]);

//   return (
//     <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export default ThemeContext;


export {}