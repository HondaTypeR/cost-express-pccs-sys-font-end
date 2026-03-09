import { addContract } from "@/services/business";
import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from "@ant-design/pro-components";
import { message, Modal } from "antd";
import { cloneElement, useRef, useState } from "react";

const CreateForm = (props) => {
  const { onOk, trigger, suppliers, projects } = props;
  const formRef = useRef();
  const [open, setOpen] = useState(false);

  return (
    <>
      <DrawerForm
        title="新建合同"
        formRef={formRef}
        open={open}
        trigger={
          trigger
            ? cloneElement(trigger, {
                onClick: () => setOpen(true),
              })
            : null
        }
        width="600px"
        drawerProps={{
          onClose: () => setOpen(false),
          destroyOnClose: true,
        }}
        onFinish={async (value) => {
          return new Promise((resolve) => {
            Modal.confirm({
              title: "确认创建",
              content: "合同创建后，仅合同名称可以修改，请仔细核对后再创建",
              okText: "确认创建",
              cancelText: "取消",
              onOk: async () => {
                // 根据 party_b_id 查找供应商名称
                const selectedSupplier = suppliers.find(
                  (s) => s.value === value.party_b_id
                );
                // 根据 project_id 查找项目名称
                const selectedProject = projects.find(
                  (p) => p.value === value.project_id
                );

                const params = {
                  ...value,
                  party_b: selectedSupplier?.label || "",
                  contract_attachment:
                    value.contract_attachment?.[0]?.response?.data
                      ?.fileList?.[0]?.fileUrl ||
                    value.contract_attachment?.[0]?.url ||
                    "",
                };
                const res = await addContract(params);

                if (res.code === 200) {
                  message.success(res?.msg || "创建成功");
                  setOpen(false);
                  onOk?.();
                  resolve(true);
                } else {
                  message.error(res?.msg || "创建失败");
                  resolve(false);
                }
              },
              onCancel: () => {
                resolve(false);
              },
            });
          });
        }}
      >
        <ProFormSelect
          name="project_id"
          label="归属项目"
          placeholder="请选择归属项目"
          options={projects}
          rules={[
            {
              required: true,
              message: "请选择归属项目",
            },
          ]}
        />
        <ProFormText
          name="project_name"
          label="合同名称"
          placeholder="请输入合同名称"
          rules={[
            {
              required: true,
              message: "请输入合同名称",
            },
          ]}
        />
        <ProFormText
          name="party_a"
          label="甲方"
          placeholder="请输入甲方名称"
          rules={[
            {
              required: true,
              message: "请输入甲方名称",
            },
          ]}
        />
        <ProFormSelect
          name="party_b_id"
          label="乙方"
          placeholder="请选择乙方（供应商）"
          options={suppliers}
          rules={[
            {
              required: true,
              message: "请选择乙方",
            },
          ]}
        />
        <ProFormDigit
          name="contract_amount"
          label="合同金额"
          placeholder="请输入合同金额"
          fieldProps={{
            precision: 2,
            style: { width: "100%" },
          }}
          rules={[
            {
              required: true,
              message: "请输入合同金额",
            },
          ]}
        />
        <ProFormSelect
          name="term"
          label="期限"
          placeholder="请选择期限"
          options={[
            { label: "一期", value: "1" },
            { label: "二期", value: "2" },
            { label: "三期", value: "3" },
            { label: "四期", value: "4" },
            { label: "五期", value: "5" },
          ]}
          rules={[
            {
              required: true,
              message: "请选择期限",
            },
          ]}
        />
        <ProFormTextArea
          name="project_content"
          label="项目内容"
          placeholder="请输入项目内容"
          fieldProps={{
            rows: 4,
          }}
          rules={[
            {
              required: true,
              message: "请输入项目内容",
            },
          ]}
        />
        <ProFormSelect
          name="type"
          label="类型"
          placeholder="请选择类型"
          options={[
            { label: "人工", value: "labor" },
            { label: "材料", value: "material" },
            { label: "机械", value: "machinery" },
            { label: "包工包料", value: "package" },
            { label: "其他", value: "other" },
          ]}
          rules={[
            {
              required: true,
              message: "请选择类型",
            },
          ]}
        />
        <ProFormTextArea
          name="material_name"
          label="材料名称"
          placeholder="请输入材料名称"
          fieldProps={{
            rows: 4,
          }}
          rules={[
            {
              required: true,
              message: "请输入材料名称",
            },
          ]}
        />
        <ProFormTextArea
          name="machinery_name"
          label="机械名称"
          placeholder="请输入机械名称"
          fieldProps={{
            rows: 4,
          }}
          rules={[
            {
              required: true,
              message: "请输入机械名称",
            },
          ]}
        />
        <ProFormUploadButton
          name="contract_attachment"
          label="合同附件"
          max={1}
          fieldProps={{
            name: "files",
            listType: "text",
            onChange: (info) => {
              if (info.file.status === "done") {
                const fileUrl =
                  info.file.response?.data?.fileList?.[0]?.fileUrl;
                if (fileUrl) {
                  info.file.url = fileUrl;
                }
              }
            },
          }}
          action="/api/contract/upload"
        />
      </DrawerForm>
    </>
  );
};

export default CreateForm;
