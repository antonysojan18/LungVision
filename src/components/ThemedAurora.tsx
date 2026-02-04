import { useTheme } from "@/contexts/ThemeContext";
import Aurora from "./Aurora";

export default function ThemedAurora() {
    const { theme } = useTheme();

    const colors = theme === "dark"
        ? ["#3A29FF", "#FF94B4", "#FF3232"] // Blue + Pinkish Red (Dark Mode)
        : ["#A0E9FF", "#B9FBC0", "#A0E9FF"]; // Cyan + Light Green (Strict)

    return (
        <Aurora
            colorStops={colors}
            blend={0.2}
            amplitude={0.5}
            speed={0.5}
        />
    );
}
