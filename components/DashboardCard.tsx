import { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface DashboardCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: LucideIcon;
    color: "red" | "blue" | "green" | "orange";
}

export function DashboardCard({ title, value, subtitle, icon: Icon, color, variant = "default" }: DashboardCardProps & { variant?: "default" | "filled" }) {
    const colorStyles = {
        red: "bg-red-50 text-red-600 border-red-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        green: "bg-green-50 text-green-600 border-green-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
    };

    const filledStyles = {
        red: "bg-red-500 text-white border-red-600",
        blue: "bg-blue-500 text-white border-blue-600",
        green: "bg-green-500 text-white border-green-600",
        orange: "bg-orange-500 text-white border-orange-600",
    };

    const iconStyles = {
        red: "bg-red-100 text-red-600",
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        orange: "bg-orange-100 text-orange-600",
    };

    const filledIconStyles = {
        red: "bg-red-600 text-white",
        blue: "bg-blue-600 text-white",
        green: "bg-green-600 text-white",
        orange: "bg-orange-600 text-white",
    };

    const isFilled = variant === "filled";
    const bgClass = isFilled ? filledStyles[color] : "bg-white border-slate-200";
    const textClass = isFilled ? "text-white/80" : "text-slate-500";
    const valueClass = isFilled ? "text-white" : "text-slate-900";
    const subtitleClass = isFilled ? "text-white/90" : colorStyles[color].replace("bg-", "text-").split(" ")[1];
    const iconClass = isFilled ? filledIconStyles[color] : iconStyles[color];

    return (
        <div className={clsx("relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:shadow-md", bgClass)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className={clsx("text-sm font-medium", textClass)}>{title}</p>
                    <h3 className={clsx("mt-2 text-3xl font-bold", valueClass)}>{value}</h3>
                    <p className={clsx("mt-1 text-sm font-medium", subtitleClass)}>
                        {subtitle}
                    </p>
                </div>
                <div className={clsx("rounded-lg p-3", iconClass)}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}
