interface Equipment {
  id: number;
  name: string;
  location: string;
  status: "running" | "idle" | "fault" | "offline";
  temperature: number;
  power: number;
  efficiency: number;
  lastMaintenance: string;
}

const mockEquipmentList: Equipment[] = [
  { id: 1, name: "CNC加工中心 #01", location: "A车间-1线", status: "running", temperature: 42, power: 85, efficiency: 96, lastMaintenance: "2026-10-10" },
  { id: 2, name: "CNC加工中心 #02", location: "A车间-1线", status: "running", temperature: 45, power: 88, efficiency: 94, lastMaintenance: "2026-10-08" },
  { id: 3, name: "数控车床 #03", location: "A车间-2线", status: "idle", temperature: 28, power: 12, efficiency: 0, lastMaintenance: "2026-10-05" },
  { id: 4, name: "激光切割机 #01", location: "B车间", status: "fault", temperature: 65, power: 45, efficiency: 0, lastMaintenance: "2026-09-28" },
  { id: 5, name: "焊接机器人 #01", location: "B车间", status: "running", temperature: 38, power: 72, efficiency: 98, lastMaintenance: "2026-10-12" },
  { id: 6, name: "冲压机 #01", location: "C车间", status: "offline", temperature: 22, power: 0, efficiency: 0, lastMaintenance: "2026-09-20" },
];

function StatusBadge({ status }: { status: Equipment["status"] }) {
  const config = {
    running: { label: "运行中", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    idle: { label: "空闲", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    fault: { label: "故障", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
    offline: { label: "离线", className: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300" },
  };
  
  const { label, className } = config[status];
  
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

export default function EquipmentList() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        设备实时状态
      </h3>
      
      <div className="mt-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">设备名称</th>
              <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">状态</th>
              <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">温度</th>
              <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">功率</th>
              <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">效率</th>
              <th className="py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">上次保养</th>
            </tr>
          </thead>
          <tbody>
            {mockEquipmentList.map((eq) => (
              <tr
                key={eq.id}
                className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <td className="py-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{eq.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{eq.location}</p>
                  </div>
                </td>
                <td className="py-3">
                  <StatusBadge status={eq.status} />
                </td>
                <td className="py-3">
                  <span className={eq.temperature > 60 ? "text-red-500 font-medium" : "text-gray-700 dark:text-gray-300"}>
                    {eq.temperature}°C
                  </span>
                </td>
                <td className="py-3 text-gray-700 dark:text-gray-300">
                  {eq.power}%
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-full rounded-full ${
                          eq.efficiency >= 90 ? "bg-green-500" :
                          eq.efficiency >= 70 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${eq.efficiency}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{eq.efficiency}%</span>
                  </div>
                </td>
                <td className="py-3 text-sm text-gray-500 dark:text-gray-400">
                  {eq.lastMaintenance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
