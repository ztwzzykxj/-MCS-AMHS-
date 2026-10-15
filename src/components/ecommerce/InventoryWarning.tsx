interface WarningItem {
  id: number;
  materialName: string;
  warehouse: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: "critical" | "warning" | "normal";
  lastUpdate: string;
}

const mockWarningData: WarningItem[] = [
  { id: 1, materialName: "轴承 #2025", warehouse: "A区", currentStock: 15, minStock: 50, maxStock: 500, status: "critical", lastUpdate: "10分钟前" },
  { id: 2, materialName: "电机轴承", warehouse: "B区", currentStock: 80, minStock: 100, maxStock: 800, status: "warning", lastUpdate: "30分钟前" },
  { id: 3, materialName: "液压油 H-46", warehouse: "C区", currentStock: 200, minStock: 100, maxStock: 1000, status: "normal", lastUpdate: "1小时前" },
  { id: 4, materialName: "密封圈 #108", warehouse: "A区", currentStock: 25, minStock: 80, maxStock: 600, status: "critical", lastUpdate: "15分钟前" },
  { id: 5, materialName: "皮带轮组件", warehouse: "D区", currentStock: 150, minStock: 200, maxStock: 1000, status: "warning", lastUpdate: "45分钟前" },
];

function StockBar({ current, min, max }: { current: number; min: number; max: number }) {
  const percentage = Math.min((current / max) * 100, 100);
  const minPercentage = (min / max) * 100;
  
  return (
    <div className="relative h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-brand-500 transition-all"
        style={{ width: `${percentage}%` }}
      />
      <div
        className="absolute top-0 h-full w-0.5 bg-gray-500"
        style={{ left: `${minPercentage}%` }}
        title={`最低库存线: ${min}`}
      />
    </div>
  );
}

export default function InventoryWarning() {
  const warningData = mockWarningData;

  const getStatusBadge = (status: WarningItem["status"]) => {
    switch (status) {
      case "critical":
        return <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">紧急补货</span>;
      case "warning":
        return <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">库存预警</span>;
      default:
        return <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">正常</span>;
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          仓储库存预警
        </h3>
        <button className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
          查看全部
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {warningData.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {item.materialName}
                  </h4>
                  {getStatusBadge(item.status)}
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  仓库: {item.warehouse} | 更新: {item.lastUpdate}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  item.status === "critical" ? "text-red-500" :
                  item.status === "warning" ? "text-yellow-500" : "text-green-500"
                }`}>
                  {item.currentStock}
                </p>
                <p className="text-xs text-gray-400">
                  最低 {item.minStock} / 最高 {item.maxStock}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <StockBar current={item.currentStock} min={item.minStock} max={item.maxStock} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
