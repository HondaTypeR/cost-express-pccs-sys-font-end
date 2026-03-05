import { AuditStatus, DocumentStatus } from "@/enum";
import { DrawerForm } from "@ant-design/pro-components";
import { Timeline } from "antd";
import { cloneElement, useState } from "react";

const ApprovalLogDrawer = (props) => {
  const { trigger, record, users } = props;
  const [open, setOpen] = useState(false);

  // 获取用户名称
  const getUserName = (userId) => {
    const user = users?.find((u) => u.value == userId);
    return user ? user.label : userId || "-";
  };

  // 获取单据状态标签
  const getDocumentStatusLabel = (status) => {
    const found = DocumentStatus.find((item) => item.value === status);
    return found ? found.label : "-";
  };

  // 获取审批状态标签
  const getAuditStatusLabel = (status) => {
    const found = AuditStatus.find((item) => item.value === status);
    return found ? found.label : "-";
  };

  // 根据单据状态生成审批流程节点
  const getTimelineItems = () => {
    const items = [];
    const currentStatus = record?.document_status || 0;
    const auditStatus = record?.audit_status || 0;

    // 获取节点的审批状态显示
    const getNodeAuditStatus = (nodeStatus) => {
      // 如果当前状态等于节点状态
      if (currentStatus === nodeStatus) {
        // 如果审核状态是待审核(0)，显示待审核
        if (auditStatus === 0) {
          return "待审核";
        }
        // 否则显示审核通过
        return "审核通过";
      }
      // 如果当前状态大于节点状态，说明已经通过了
      if (currentStatus > nodeStatus) {
        return "审核通过";
      }
      // 还未到达该节点
      return null;
    };

    // 经办人发起审批 (status 0)
    const handlerStatus = getNodeAuditStatus(0);
    items.push({
      color: currentStatus >= 0 ? "blue" : "gray",
      children: (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            经办人:{getUserName(record?.handler)}
          </div>
          {handlerStatus && (
            <>
              <div style={{ color: "#666", fontSize: 12, marginBottom: 4 }}>
                审批状态：{handlerStatus}
              </div>
            </>
          )}
        </div>
      ),
    });

    // 经办部门负责人审批 (status 1)
    const handlerDeptStatus = getNodeAuditStatus(1);
    items.push({
      color: currentStatus >= 1 ? "blue" : "gray",
      children: (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            经办部门负责人:{getUserName(record?.handlerDept)}
          </div>
          {handlerDeptStatus && record?.handlerDept && (
            <>
              <div style={{ color: "#999", fontSize: 12, marginBottom: 4 }}>
                审批状态：{handlerDeptStatus}
              </div>
              {record?.handlerDept_opinion && (
                <div style={{ color: "#999", fontSize: 12, marginBottom: 4 }}>
                  审批意见：{record?.handlerDept_opinion}
                </div>
              )}
            </>
          )}
        </div>
      ),
    });

    // 财务部负责人审批 (status 2)
    const finceDeptStatus = getNodeAuditStatus(2);
    items.push({
      color: currentStatus >= 2 ? "blue" : "gray",
      children: (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            财务部负责人:{getUserName(record?.finceDept)}
          </div>
          {finceDeptStatus && record?.finceDept && (
            <>
              <div style={{ color: "#999", fontSize: 12, marginBottom: 4 }}>
                审批状态：{finceDeptStatus}
              </div>
              {record?.finceDept_opinion && (
                <div style={{ color: "#999", fontSize: 12, marginBottom: 4 }}>
                  审批意见：{record?.finceDept_opinion}
                </div>
              )}
            </>
          )}
        </div>
      ),
    });

    // 复核人审批 (status 3)
    const recheckerStatus = getNodeAuditStatus(3);
    items.push({
      color: currentStatus >= 3 ? "blue" : "gray",
      children: (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            复核人:{getUserName(record?.rechecker)}
          </div>
          {recheckerStatus && record?.rechecker && (
            <>
              <div style={{ color: "#999", fontSize: 12, marginBottom: 4 }}>
                审批状态：{recheckerStatus}
              </div>
              {record?.rechecker_opinion && (
                <div style={{ color: "#999", fontSize: 12, marginBottom: 4 }}>
                  审批意见：{record?.rechecker_opinion}
                </div>
              )}
            </>
          )}
        </div>
      ),
    });

    // 终审人审批 (status 4) - 最后节点，展示实际的audit_status
    items.push({
      color: currentStatus >= 4 ? "blue" : "gray",
      children: (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            终审人:{getUserName(record?.finalChecker)}
          </div>
          {currentStatus >= 4 && record?.finalChecker && (
            <>
              <div style={{ color: "#999", fontSize: 12, marginBottom: 4 }}>
                审批状态：{getAuditStatusLabel(record?.audit_status)}
              </div>
              {record?.finalChecker_opinion && (
                <div style={{ color: "#999", fontSize: 12, marginBottom: 4 }}>
                  审批意见：{record?.finalChecker_opinion}
                </div>
              )}
            </>
          )}
        </div>
      ),
    });

    // 完结归档 (status 10)
    items.push({
      color: currentStatus >= 10 ? "green" : "gray",
      children: (
        <div>
          <div
            style={{
              fontWeight: 500,
              marginBottom: 4,
              color: currentStatus >= 10 ? "#52c41a" : "#666",
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
    <DrawerForm
      title="审批流程"
      open={open}
      trigger={
        trigger &&
        cloneElement(trigger, {
          onClick: () => setOpen(true),
        })
      }
      width={600}
      drawerProps={{
        onClose: () => setOpen(false),
        destroyOnClose: true,
      }}
      submitter={false}
    >
      <Timeline items={getTimelineItems()} />
    </DrawerForm>
  );
};

export default ApprovalLogDrawer;
