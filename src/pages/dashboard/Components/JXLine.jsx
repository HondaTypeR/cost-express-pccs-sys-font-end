import { listMechanical } from "@/services/business";
import { Chart } from "@antv/g2";
import { Card } from "antd";
import { useEffect, useRef, useState } from "react";
import { formatThousands } from "../helper";

const JXLine = () => {
  // 图表容器
  const chartRef3 = useRef(null);
  // 图表实例（用于销毁）
  const chartInstanceRef3 = useRef(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    listMechanical({
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
    if (chartInstanceRef3.current) return;

    // 初始化图表
    const chart = new Chart({
      container: chartRef3.current,
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
    chartInstanceRef3.current = chart;

    // 销毁（防止内存泄漏）
    return () => {
      if (chartInstanceRef3.current) {
        chartInstanceRef3.current.destroy();
        chartInstanceRef3.current = null;
      }
    };
  }, [data]);

  return (
    <Card title="机械统计" style={{ width: "100%" }}>
      <div ref={chartRef3} style={{ height: 400 }} />
    </Card>
  );
};

export default JXLine;
