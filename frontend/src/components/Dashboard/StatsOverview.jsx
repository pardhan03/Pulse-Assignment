import { useMemo } from "react";
import StatsCard from "../common/StatsCard";
import { useState } from "react";
import { useEffect } from "react";
import { getUsreStats } from "../../api/axios";

const StatsOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStatsData = async () => {
        try {
            const response = await getUsreStats();
            if(response?.data){
                setData(response.data.data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStatsData();
    }, []);

    const stats = useMemo(() => {
        if (!data) return [];

        return [
            { key: "total", title: "Total Videos", value: data?.totalVideos },
            { key: "processing", title: "Processing", value: data?.processingVideos },
            { key: "completed", title: "Completed", value: data?.completedVideos },
            { key: "failed", title: "Failed", value: data?.failedVideos },
            { key: "safe", title: "Safe", value: data?.safeVideos },
            { key: "flagged", title: "Flagged", value: data?.flaggedVideos },
        ];
    }, [data]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {stats.map((stat, index) => (
                <StatsCard
                    key={index}
                    themeKey={stat.key}
                    title={stat.title}
                    value={stat.value}
                    footer={stat.footer}
                    trending={stat.trending}
                />
            ))}
        </div>
    );
};

export default StatsOverview;