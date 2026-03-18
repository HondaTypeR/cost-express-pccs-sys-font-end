import { listReviewLog } from "@/services/business";
import { Drawer, Timeline } from "antd";
import dayjs from "dayjs";
import { cloneElement, useState } from "react";

const ReviewLogModal = (props) => {
  const { trigger, recordId } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const fetchLog = async () => {
    setLoading(true);
    try {
      const res = await listReviewLog({
        link_info: recordId,
        log_type: "财务",
      });
      if (res?.code === 200) {
        const arr = Array.isArray(res?.data) ? res.data : [];
        const sorted = [...arr].sort((a, b) => {
          const ta =
            (a?.update_time && new Date(a.update_time).getTime()) ||
            (a?.create_time && new Date(a.create_time).getTime()) ||
            0;
          const tb =
            (b?.update_time && new Date(b.update_time).getTime()) ||
            (b?.create_time && new Date(b.create_time).getTime()) ||
            0;
          return tb - ta;
        });
        setLogs(sorted);
      } else {
        setLogs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const currentLog = logs?.[0];

  const getStatusColor = (status) => {
    if (!status) return "gray";
    if (String(status).includes("驳回") || String(status).includes("拒绝")) {
      return "red";
    }
    if (String(status).includes("待")) return "gray";
    return "blue";
  };

  const renderNode = (title, reviewer, status, remark, time) => {
    const showTime =
      !!time &&
      !!status &&
      !String(status).includes("待") &&
      !String(status).includes("待审");

    return (
      <div>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>
          {title}:{reviewer || "-"}
        </div>
        {status ? (
          <div style={{ color: "#666", fontSize: 12, marginBottom: 4 }}>
            审批状态：{status}
          </div>
        ) : null}
        {remark ? (
          <div style={{ color: "#999", fontSize: 12, marginBottom: 4 }}>
            审批备注：{remark}
          </div>
        ) : null}
        {showTime ? (
          <div style={{ color: "#999", fontSize: 12 }}>
            时间：{dayjs(time).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        ) : null}
      </div>
    );
  };

  const getTimelineItems = () => {
    const items = [];
    if (!currentLog) return items;

    items.push({
      color: getStatusColor(currentLog?.level_one_review_status),
      children: renderNode(
        "经办人",
        currentLog?.level_one_reviewer,
        currentLog?.level_one_review_status,
        currentLog?.level_one_review_remark,
        currentLog?.create_time
      ),
    });

    items.push({
      color: getStatusColor(currentLog?.level_two_review_status),
      children: renderNode(
        "经办部门负责人",
        currentLog?.level_two_reviewer,
        currentLog?.level_two_review_status,
        currentLog?.level_two_review_remark,
        currentLog?.update_time
      ),
    });

    items.push({
      color: getStatusColor(currentLog?.level_three_review_status),
      children: renderNode(
        "财务部负责人",
        currentLog?.level_three_reviewer,
        currentLog?.level_three_review_status,
        currentLog?.level_three_review_remark,
        currentLog?.update_time
      ),
    });

    items.push({
      color: getStatusColor(currentLog?.level_four_review_status),
      children: renderNode(
        "复核人",
        currentLog?.level_four_reviewer,
        currentLog?.level_four_review_status,
        currentLog?.level_four_review_remark,
        currentLog?.update_time
      ),
    });

    items.push({
      color: getStatusColor(currentLog?.level_five_review_status),
      children: renderNode(
        "终审人",
        currentLog?.level_five_reviewer,
        currentLog?.level_five_review_status,
        currentLog?.level_five_review_remark,
        currentLog?.update_time
      ),
    });

    const isNotRejected = (status) => {
      const s = String(status || "");
      if (!s) return false;
      return !s.includes("驳回") && !s.includes("拒绝");
    };

    const isAllPass =
      isNotRejected(currentLog?.level_one_review_status) &&
      String(currentLog?.level_two_review_status || "").includes("通过") &&
      String(currentLog?.level_three_review_status || "").includes("通过") &&
      String(currentLog?.level_four_review_status || "").includes("通过") &&
      String(currentLog?.level_five_review_status || "").includes("通过");

    items.push({
      color: isAllPass ? "green" : "gray",
      children: (
        <div>
          <div
            style={{
              fontWeight: 500,
              marginBottom: 4,
              color: isAllPass ? "#52c41a" : "#666",
            }}
          >
            完结归档
          </div>
        </div>
      ),
    });

    return items;
  };

  return (
    <>
      {trigger
        ? cloneElement(trigger, {
            onClick: async () => {
              setOpen(true);
              await fetchLog();
            },
          })
        : null}
      <Drawer
        title="审批流程"
        open={open}
        onClose={() => setOpen(false)}
        destroyOnClose
        width={600}
        placement="right"
      >
        {loading ? (
          <div>加载中...</div>
        ) : logs.length === 0 ? (
          <div>暂无审批日志</div>
        ) : (
          <Timeline items={getTimelineItems()} />
        )}
      </Drawer>
    </>
  );
};

export default ReviewLogModal;
