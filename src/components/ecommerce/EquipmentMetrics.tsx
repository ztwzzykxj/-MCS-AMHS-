import { ArrowUpIcon, ArrowDownIcon } from "@/icons";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, trend, icon, color }: MetricCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {trend >= 0 ? (
                <ArrowUpIcon className="size-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="size-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend >= 0 ? "+" : ""}
                {trend}%
              </span>
              <span className="text-sm text-gray-400">vs last period</span>
            </div>
          )}
        </div>
        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

interface EquipmentMetricsProps {
  data?: {
    total: number;
    running: number;
    idle: number;
    fault: number;
    offline: number;
  };
}

export default function EquipmentMetrics({ data }: EquipmentMetricsProps) {
  const metrics = data || {
    total: 156,
    running: 128,
    idle: 18,
    fault: 5,
    offline: 5,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="设备总数"
        value={metrics.total}
        icon={
          <svg className="size-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
        color="bg-blue-100"
      />
      <MetricCard
        title="运行中"
        value={metrics.running}
        trend={3.2}
        icon={
          <svg className="size-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        color="bg-green-100"
      />
      <MetricCard
        title="空闲待机"
        value={metrics.idle}
        trend={-1.5}
        icon={
          <svg className="size-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        color="bg-yellow-100"
      />
      <MetricCard
        title="故障告警"
        value={metrics.fault}
        trend={-0.8}
        icon={
          <svg className="size-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
        color="bg-red-100"
      />
    </div>
  );
}
