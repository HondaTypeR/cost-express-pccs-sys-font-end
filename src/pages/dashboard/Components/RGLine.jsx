import { listArtificial } from "@/services/business";
import { Chart } from "@antv/g2";
import { Card } from "antd";
import { useEffect, useRef, useState } from "react";
import { formatThousands } from "../helper";

const RGLine = () => {
  // 图表容器
  const chartRef4 = useRef(null);
  // 图表实例（用于销毁）
  const chartInstanceRef4 = useRef(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    listArtificial({
      params: { page: 1, pageSize: 9999, audit_status: 1, document_status: 3 },
    }).then((res) => {
      const newData = [];
      res?.data?.forEach((item) => {
        newData.push({
          name: item.material_name,
          value: item.total_price,
          quantity: item.quantity,
          unit_price: item.unit_price,
          unit: item.unit,
          spec_model: item.spec_model,
        });
      });
      setData(newData);
    });
  }, []);

  useEffect(() => {
    // 避免重复创建
    if (chartInstanceRef4.current) return;

    // 初始化图表
    const chart = new Chart({
      container: chartRef4.current,
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
    chartInstanceRef4.current = chart;

    // 销毁（防止内存泄漏）
    return () => {
      if (chartInstanceRef4.current) {
        chartInstanceRef4.current.destroy();
        chartInstanceRef4.current = null;
      }
    };
  }, [data]);

  return (
    <Card title="人工统计" style={{ width: "100%" }}>
      <div ref={chartRef4} style={{ height: 400 }} />
    </Card>
  );
};

export default RGLine;
