import { useEffect, useRef } from "react";

interface EquipmentStatusChartProps {
  data?: {
    labels: string[];
    running: number[];
    idle: number[];
    fault: number[];
  };
}

export default function EquipmentStatusChart({ data }: EquipmentStatusChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const chartData = data || {
    labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
    running: [85, 88, 92, 78, 95, 82, 80],
    idle: [10, 8, 5, 15, 3, 12, 15],
    fault: [5, 4, 3, 7, 2, 6, 5],
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    const maxValue = 100;
    const gridLines = 5;

    // Draw grid lines
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`${maxValue - (maxValue / gridLines) * i}%`, padding.left - 8, y + 4);
    }

    // X-axis labels
    ctx.textAlign = "center";
    const step = chartData.labels.length > 1 ? chartWidth / (chartData.labels.length - 1) : chartWidth;
    chartData.labels.forEach((label, i) => {
      const x = padding.left + step * i;
      ctx.fillText(label, x, rect.height - 10);
    });

    // Draw lines
    const drawLine = (values: number[], color: string, dashed: boolean = false) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      if (dashed) ctx.setLineDash([5, 5]);
      else ctx.setLineDash([]);

      ctx.beginPath();
      values.forEach((val, i) => {
        const x = padding.left + step * i;
        const y = padding.top + chartHeight - (val / maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    };

    drawLine(chartData.running, "#22C55E");
    drawLine(chartData.idle, "#EAB308");
    drawLine(chartData.fault, "#EF4444", true);

  }, [chartData]);

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        车间设备运行状态趋势
      </h3>
      <div className="mt-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500"></span>
          <span className="text-sm text-gray-500 dark:text-gray-400">运行中</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
          <span className="text-sm text-gray-500 dark:text-gray-400">空闲待机</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500"></span>
          <span className="text-sm text-gray-500 dark:text-gray-400">故障告警</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="mt-4 h-64 w-full"
        style={{ width: "100%", height: "256px" }}
      />
    </div>
  );
}
