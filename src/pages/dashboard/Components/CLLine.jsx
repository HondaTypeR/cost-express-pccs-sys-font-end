import { listMaterial } from "@/services/business";
import { Chart } from "@antv/g2";
import { Card } from "antd";
import { useEffect, useRef, useState } from "react";
import { formatThousands } from "../helper";

const CLLine = () => {
  // 图表容器
  const chartRef = useRef(null);
  // 图表实例（用于销毁）
  const chartInstanceRef = useRef(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    listMaterial({
      params: { page: 1, pageSize: 9999, audit_status: 1, document_status: 3 },
    }).then((res) => {
      const newData = [];
      res?.data?.forEach((item) => {
        newData.push({
          name: item.material_name,
          value: item.total_price ? Number(item.total_price) : 0,
          quantity: item.quantity ? Number(item.quantity) : 0,
          unit_price: item.unit_price ? Number(item.unit_price) : 0,
          unit: item.unit,
          spec_model: item.spec_model,
        });
      });
      setData(newData);
    });
  }, []);

  useEffect(() => {
    // 避免重复创建
    if (chartInstanceRef.current) return;

    // 初始化图表
    const chart = new Chart({
      container: chartRef.current,
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
    chartInstanceRef.current = chart;

    // 销毁（防止内存泄漏）
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <Card title="材料统计" style={{ width: "100%" }}>
      <div ref={chartRef} style={{ height: 400 }} />
    </Card>
  );
};

export default CLLine;
