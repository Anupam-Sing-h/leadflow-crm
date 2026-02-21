"use client";

import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

// Mock data for the Area Chart (Lead Growth)
const areaData = [
    { name: "Jan", leads: 400 },
    { name: "Feb", leads: 300 },
    { name: "Mar", leads: 550 },
    { name: "Apr", leads: 450 },
    { name: "May", leads: 700 },
    { name: "Jun", leads: 650 },
    { name: "Jul", leads: 900 },
];

// Mock data for the Bar Chart (Pipeline Stages)
const barData = [
    { name: "New", count: 120 },
    { name: "Contacted", count: 85 },
    { name: "Qualified", count: 50 },
    { name: "Proposal", count: 30 },
    { name: "Won", count: 18 },
];

export function HeroCharts() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Top Left Area Chart */}
            <div className="absolute -top-10 -left-20 w-[600px] h-[400px] opacity-10 rotate-[-5deg] scale-125 md:scale-150 animate-in fade-in duration-1000">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData}>
                        <defs>
                            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="leads"
                            stroke="#2563eb"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorLeads)"
                            isAnimationActive={true}
                            animationDuration={2500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom Right Bar Chart */}
            <div className="absolute -bottom-20 -right-20 w-[600px] h-[350px] opacity-[0.08] rotate-[5deg] scale-125 md:scale-150 animate-in fade-in duration-1000 delay-500 fill-mode-both">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Bar
                            dataKey="count"
                            fill="#8b5cf6"
                            radius={[10, 10, 0, 0]}
                            isAnimationActive={true}
                            animationDuration={2500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
