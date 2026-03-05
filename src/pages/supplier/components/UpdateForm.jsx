import { supplierUpdate } from "@/services/supplier";
import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { message } from "antd";
import { cloneElement, useState } from "react";

const UpdateForm = (props) => {
  const { onOk, values, trigger } = props;

  const [open, setOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  return (
    <>
      {contextHolder}
      <ModalForm
        title="编辑供应商"
        open={open}
        trigger={
          trigger
            ? cloneElement(trigger, { onClick: () => setOpen(true) })
            : null
        }
        width="600px"
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setOpen(false),
        }}
        initialValues={values}
        onFinish={async (formValues) => {
          const res = await supplierUpdate({
            ...formValues,
            supplier_id: values.supplier_id,
          });
          if (res.code === 200) {
            messageApi.success(res.msg);
            setOpen(false);
            onOk?.();
          } else {
            messageApi.error(res.msg);
          }
        }}
      >
        <ProFormText
          label="公司名称"
          name="supplier_name"
          rules={[
            {
              required: true,
              message: "请输入公司名称",
            },
          ]}
          placeholder="请输入公司名称"
        />
        <ProFormText
          label="收款开户银行"
          name="supplier_bank"
          rules={[
            {
              required: true,
              message: "请输入收款开户银行",
            },
          ]}
          placeholder="请输入收款开户银行"
        />
        <ProFormText
          label="收款开户银行账号"
          name="supplier_account"
          rules={[
            {
              required: true,
              message: "请输入收款开户银行账号",
            },
          ]}
          placeholder="请输入收款开户银行账号"
        />
      </ModalForm>
    </>
  );
};

export default UpdateForm;
