import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
} from "@ant-design/pro-components";
import { message } from "antd";
import { cloneElement, useRef, useState } from "react";

const ApprovalModal = (props) => {
  const { trigger, users, onOk, currentStatus, currentAmount } = props;
  const formRef = useRef();
  const [open, setOpen] = useState(false);

  return (
    <ModalForm
      title="发起审批"
      formRef={formRef}
      open={open}
      trigger={cloneElement(trigger, {
        onClick: () => setOpen(true),
      })}
      width={400}
      modalProps={{
        onCancel: () => setOpen(false),
        destroyOnClose: true,
      }}
      initialValues={{
        total_amount: currentAmount || 0,
      }}
      onFinish={async (values) => {
        if (!values.reviewer) {
          message.error("请选择审批人");
          return false;
        }

        const success = await onOk?.(values.reviewer);
        if (success) {
          setOpen(false);
          return true;
        }
        return false;
      }}
    >
      <ProFormSelect
        name="reviewer"
        label="选择审批人"
        placeholder="请选择审批人"
        options={users}
        rules={[
          {
            required: true,
            message: "请选择审批人",
          },
        ]}
        fieldProps={{
          showSearch: true,
          filterOption: (input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
        }}
      />
      <ProFormDigit
        name="total_amount"
        label="总金额"
        placeholder="请输入总金额"
        disabled
        fieldProps={{
          precision: 2,
          valueType: "money",
        }}
      />
      <div style={{ color: "#666", fontSize: 12, marginTop: -16 }}>
        当前状态将从 <strong>{getStatusLabel(currentStatus)}</strong> 变更为{" "}
        <strong>{getStatusLabel(currentStatus + 1)}</strong>
      </div>
    </ModalForm>
  );
};

const getStatusLabel = (status) => {
  const statusMap = {
    0: "草稿",
    1: "发起审核",
    2: "复审通过",
    3: "已归档",
  };
  return statusMap[status] || "未知";
};

export default ApprovalModal;
