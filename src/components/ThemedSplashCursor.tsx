import { useMemo } from 'react';
import { useTheme } from "@/contexts/ThemeContext";
import SplashCursor from "./SplashCursor";

export default function ThemedSplashCursor() {
    const { theme } = useTheme();

    const colors = useMemo(() => theme === "dark"
        ? ["#3A29FF", "#FF3232"] // Blue + Red (Dark Mode)
        : ["#0D2818", "#1a3f50"], [theme]); // Dark Green + Navy (Light Mode)

    const splatRadius = theme === "dark" ? 0.04 : 0.05;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
            <SplashCursor colors={colors} SPLAT_RADIUS={splatRadius} />
        </div>
    );
}
