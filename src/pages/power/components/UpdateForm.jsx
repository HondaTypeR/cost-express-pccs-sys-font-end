import { MenuOptions, PowerStatus } from "@/enum";
import {
  ModalForm,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { message } from "antd";
import { cloneElement, useState } from "react";

const UpdateForm = (props) => {
  const { onOk, values, trigger } = props;

  const [open, setOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  // const { run, loading } = useRequest(updateRule, {
  //   manual: true,
  //   onSuccess: () => {
  //     messageApi.success("更新成功");
  //     setOpen(false);
  //     onOk?.();
  //   },
  //   onError: () => {
  //     messageApi.error("更新失败，请重试！");
  //   },
  // });

  return (
    <>
      {contextHolder}
      <ModalForm
        title="编辑角色"
        open={open}
        trigger={
          trigger
            ? cloneElement(trigger, { onClick: () => setOpen(true) })
            : null
        }
        width="600px"
        modalProps={{
          //okButtonProps: { loading },
          onCancel: () => setOpen(false),
        }}
        initialValues={values}
        onFinish={async (formValues) => {
          // await run({ data: { ...formValues, key: values.key } });
          // return true;
        }}
      >
        <ProFormText
          label="角色名称"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入角色名称",
            },
          ]}
          placeholder="请输入角色名称"
        />
        <ProFormText
          label="角色描述"
          name="description"
          placeholder="请输入角色描述"
        />
        <ProFormCheckbox.Group
          label="数据权限"
          name="dataPermission"
          options={PowerStatus}
          rules={[
            {
              required: true,
              message: "请选择权限",
            },
          ]}
        />
        <ProFormCheckbox.Group
          label="菜单权限"
          name="menuPermission"
          options={MenuOptions}
          rules={[
            {
              required: true,
              message: "请选择权限",
            },
          ]}
        />
      </ModalForm>
    </>
  );
};

export default UpdateForm;
