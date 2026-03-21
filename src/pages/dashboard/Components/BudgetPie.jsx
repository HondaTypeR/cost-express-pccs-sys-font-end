import { findProjectCostPie } from "@/services/business";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Chart } from "@antv/g2";
import { Card, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { formatThousands } from "../helper";
import BudgetLine from "./BudgetLine";

const BudgetPie = () => {
  // 图表容器引用
  const chartRef = useRef(null);
  // 图表实例引用
  const instanceRef = useRef(null);
  const [data, setData] = useState();
  const [summary, setSummary] = useState();

  useEffect(() => {
    findProjectCostPie({ params: { project_id: 8 } }).then((res) => {
      if (res?.code === 200) {
        const newData = [];
        res?.data?.items?.forEach((item) => {
          newData.push({
            item: item.label,
            percent: item.percent,
            actual_total: item.actual_total,
            budget_total: item.budget_total,
            variance: item.variance,
          });
        });
        setData(newData);
        setSummary(res?.data?.summary);
      } else {
        message.error("获取预算分布数据失败");
      }
    });
  }, []);

  useEffect(() => {
    // 防止重复创建
    if (instanceRef.current) return;

    // 初始化图表
    const chart = new Chart({
      container: chartRef.current,
      autoFit: true,
    });

    // 配置
    chart.options({
      type: "interval",
      height: 400,
      data: data,
      coordinate: { type: "theta", innerRadius: 0.5, outerRadius: 0.8 },
      transform: [{ type: "stackY" }],
      encode: {
        y: "percent",
        color: "item",
      },
      legend: { color: { position: "bottom" } },
      tooltip: {
        title: (d) => d.item,
        items: [
          {
            channel: "y",
            name: "占比",
            valueFormatter: (v) => `${(v * 100).toFixed(2)}%`,
          },
        ],
      },
      labels: [
        {
          text: (d) => `${d.item} ${(d.percent * 100).toFixed(2)}%`,
          position: "spider",
          fontSize: 12,
        },
      ],
      interaction: {
        elementHoverScale: {
          scale: 1.08,
          shadow: true,
          shadowColor: "rgba(0, 0, 0, 0.5)",
          shadowBlur: 15,
        },
      },
    });

    // 渲染
    chart.render();
    instanceRef.current = chart;

    // 组件销毁时销毁图表（重要！防止内存泄漏）
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <Card
      title="预算分布"
      extra={
        <div style={{ display: "flex", fontWeight: "bold" }}>
          实际总额:{formatThousands(summary?.actual_grand_total || 0)}
          <span style={{ margin: "0 10px" }}></span>
          预算总额:{formatThousands(summary?.budget_grand_total || 0)}
          <span style={{ margin: "0 10px" }}></span>
          偏差:{" "}
          <span
            style={{
              color:
                summary?.actual_grand_total - summary?.budget_grand_total > 0
                  ? "red"
                  : "green",
            }}
          >
            {summary?.actual_grand_total - summary?.budget_grand_total > 0 ? (
              <ArrowUpOutlined />
            ) : (
              <ArrowDownOutlined />
            )}
            {formatThousands(summary?.variance_total || 0)}
          </span>
        </div>
      }
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div ref={chartRef} />
        <BudgetLine data={data} />
      </div>
    </Card>
  );
};

export default BudgetPie;
