import PageMeta from "@/components/common/PageMeta";
import EquipmentMetrics from "@/components/ecommerce/EquipmentMetrics";
import EquipmentStatusChart from "@/components/ecommerce/EquipmentStatusChart";
import EquipmentList from "@/components/ecommerce/EquipmentList";
import InventoryWarning from "@/components/ecommerce/InventoryWarning";

export default function Ecommerce() {
  return (
    <>
      <PageMeta
        title="MCS-AMHS 车间监控中心 | 村田机械 MCS 系统"
        description="村田机械 MCS-AMHS 系统 - 车间设备运行状态与仓储库存预警看板"
      />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          车间设备运行状态监控
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          实时监控车间设备运行状态与仓储库存预警
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* 设备状态指标卡片 */}
        <div className="col-span-12">
          <EquipmentMetrics />
        </div>

        {/* 设备状态趋势图 */}
        <div className="col-span-12 xl:col-span-8">
          <EquipmentStatusChart />
        </div>

        {/* 库存预警 */}
        <div className="col-span-12 xl:col-span-4">
          <InventoryWarning />
        </div>

        {/* 设备实时状态列表 */}
        <div className="col-span-12">
          <EquipmentList />
        </div>
      </div>
    </>
  );
}
