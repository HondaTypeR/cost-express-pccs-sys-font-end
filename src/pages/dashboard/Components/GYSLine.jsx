import { allListMaterials } from "@/services/business";
import { supplierList } from "@/services/supplier";
import { Chart } from "@antv/g2";
import { Card } from "antd";
import { useEffect, useRef, useState } from "react";
import { formatThousands } from "../helper";

const GYSLine = () => {
  // 图表容器
  const chartRef5 = useRef(null);
  // 图表实例（用于销毁）
  const chartInstanceRef5 = useRef(null);
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const res = await supplierList();
    const resAll = await allListMaterials();
    const newData = [];
    resAll?.data?.list?.forEach((item) => {
      newData.push({
        ...item,
        name: res?.data?.find(
          (supplier) => supplier.supplier_id == item.supplier
        )?.supplier_name,
        value: item.total_amount ? Number(item.total_amount) : 0,
        quantity: item.quantity ? Number(item.quantity) : 0,
        unit_price: item.contract_unit_price
          ? Number(item.contract_unit_price)
          : 0,
        unit: item.unit,
        spec_model: item.spec_model,
      });
    });
    setData(newData);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // 避免重复创建
    if (chartInstanceRef5.current) return;

    // 初始化图表
    const chart = new Chart({
      container: chartRef5.current,
      theme: "classic",
      autoFit: true,
    });

    // 配置
    chart.options({
      type: "interval",
      data: data,
      encode: { x: "name", y: "value", color: "name" },
      axis: {
        y: { labelFormatter: (v) => formatThousands(Number(v)) },
      },
      tooltip: {
        title: (d) => d.name,
        items: [
          {
            channel: "y",
            name: "合同总价",
            valueFormatter: (v) => formatThousands(v),
          },
          {
            name: "数量",
            field: "quantity",
            valueFormatter: (v) => formatThousands(v),
          },
          {
            name: "单价",
            field: "unit_price",
            valueFormatter: (v) => formatThousands(v),
          },
          { name: "单位", field: "unit" },
          { name: "规格", field: "spec_model" },
        ],
      },
      interaction: [
        {
          type: "elementHighlight",
          background: true,
          region: true,
        },
      ],
    });

    // 渲染
    chart.render();
    chartInstanceRef5.current = chart;

    // 销毁（防止内存泄漏）
    return () => {
      if (chartInstanceRef5.current) {
        chartInstanceRef5.current.destroy();
        chartInstanceRef5.current = null;
      }
    };
  }, [data]);

  return (
    <Card title="供应商统计" style={{ width: "100%" }}>
      <div ref={chartRef5} style={{ height: 400 }} />
    </Card>
  );
};

export default GYSLine;
