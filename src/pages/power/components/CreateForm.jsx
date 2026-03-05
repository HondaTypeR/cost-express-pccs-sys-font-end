import { MenuOptions, PowerStatus } from "@/enum";
import { PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, message } from "antd";

const CreateForm = (props) => {
  const { reload } = props;

  const [messageApi, contextHolder] = message.useMessage();

  // const { run, loading } = useRequest(addRule, {
  //   manual: true,
  //   onSuccess: () => {
  //     messageApi.success("添加成功");
  //     reload?.();
  //   },
  //   onError: () => {
  //     messageApi.error("添加失败，请重试！");
  //   },
  // });

  return (
    <>
      {contextHolder}
      <ModalForm
        title="新建角色"
        trigger={
          <Button type="primary" icon={<PlusOutlined />}>
            新建
          </Button>
        }
        width="600px"
        // modalProps={{ okButtonProps: { loading } }}
        onFinish={async (value) => {
          // await run({ data: value });
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

export default CreateForm;
