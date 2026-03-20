import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { message } from "antd";
import { cloneElement, useRef, useState } from "react";

const FinalApprovalModal = (props) => {
  const { trigger, onOk, currentAmount } = props;
  const formRef = useRef();
  const [open, setOpen] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(1); // 1: 通过, 2: 拒绝

  return (
    <ModalForm
      title="终审审批"
      formRef={formRef}
      open={open}
      trigger={cloneElement(trigger, {
        onClick: () => setOpen(true),
      })}
      width={500}
      modalProps={{
        onCancel: () => {
          setOpen(false);
          setApprovalStatus(1);
        },
        destroyOnClose: true,
      }}
      initialValues={{
        total_amount: currentAmount || 0,
      }}
      onFinish={async (values) => {
        if (approvalStatus === 2 && !values.reject_reason) {
          message.error("请填写拒绝原因");
          return false;
        }

        const success = await onOk?.(
          approvalStatus,
          values.approval_reason,
          values.reject_reason,
          values.total_amount
        );
        if (success) {
          setOpen(false);
          setApprovalStatus(1);
          return true;
        }
        return false;
      }}
    >
      <ProFormRadio.Group
        name="approval_status"
        label="审批意见"
        initialValue={1}
        fieldProps={{
          onChange: (e) => {
            setApprovalStatus(e.target.value);
          },
        }}
        options={[
          { label: "通过", value: 1 },
          { label: "拒绝", value: 2 },
        ]}
        rules={[
          {
            required: true,
            message: "请选择审批意见",
          },
        ]}
      />

      {approvalStatus === 1 && (
        <>
          <ProFormDigit
            name="total_amount"
            label="最终审批金额"
            placeholder="请输入最终审批金额"
            fieldProps={{
              precision: 2,
            }}
            rules={[
              {
                required: true,
                message: "请输入最终审批金额",
              },
            ]}
          />
          <ProFormTextArea
            name="approval_reason"
            label="通过理由"
            placeholder="请输入通过理由（选填）"
            fieldProps={{
              rows: 4,
            }}
          />
        </>
      )}

      {approvalStatus === 2 && (
        <ProFormTextArea
          name="reject_reason"
          label="拒绝原因"
          placeholder="请输入拒绝原因"
          rules={[
            {
              required: true,
              message: "请输入拒绝原因",
            },
          ]}
          fieldProps={{
            rows: 4,
          }}
        />
      )}
    </ModalForm>
  );
};

export default FinalApprovalModal;
