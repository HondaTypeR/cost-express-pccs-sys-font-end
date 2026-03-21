import { addImportedBudget } from "@/services/business";
import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { message } from "antd";
import { cloneElement, useRef, useState } from "react";

const CreateForm = (props) => {
  const { onOk, trigger, projects } = props;
  const formRef = useRef();
  const [open, setOpen] = useState(false);

  return (
    <>
      <DrawerForm
        title="新建预算"
        formRef={formRef}
        open={open}
        trigger={cloneElement(trigger, {
          onClick: () => {
            setOpen(true);
          },
        })}
        width="600px"
        drawerProps={{
          onClose: () => setOpen(false),
          destroyOnClose: true,
        }}
        onFinish={async (value) => {
          const projectItem = (projects || []).find(
            (p) => String(p.value) === String(value.project_id)
          );
          const params = {
            ...value,
            project_id: String(value.project_id),
            project_name: projectItem?.project_name || projectItem?.label,
          };
          const res = await addImportedBudget(params);

          if (res.code === 200) {
            message.success(res?.msg || "创建成功");
            setOpen(false);
            onOk?.();
            return true;
          } else {
            message.error(res?.msg || "创建失败");
            return false;
          }
        }}
      >
        <ProFormSelect
          name="project_id"
          label="归属项目"
          placeholder="请选择项目"
          options={projects?.map((p) => ({
            value: String(p.value),
            label: p.label,
          }))}
          rules={[{ required: true, message: "请选择项目" }]}
        />
        <ProFormSelect
          name="types"
          label="类型"
          placeholder="请选择类型"
          options={[
            { value: "other", label: "其他" },
            { value: "jx", label: "机械" },
            { value: "cl", label: "材料" },
            { value: "rg", label: "人工" },
          ]}
          rules={[{ required: true, message: "请选择类型" }]}
        />
        <ProFormSelect
          name="issue"
          label="归属期数"
          placeholder="请选择期数"
          options={[
            { value: "all", label: "全部" },
            { value: "1", label: "一期" },
            { value: "2", label: "二期" },
            { value: "3", label: "三期" },
            { value: "4", label: "四期" },
            { value: "5", label: "五期" },
          ]}
          rules={[{ required: true, message: "请选择期数" }]}
        />
        <ProFormText
          name="name"
          label="名称"
          placeholder="请输入名称"
          rules={[{ required: true, message: "请输入名称" }]}
        />
        <ProFormText
          name="spec_model"
          label="规格型号"
          placeholder="请输入规格型号"
        />
        <ProFormText name="unit" label="单位" placeholder="请输入单位" />
        <ProFormDigit
          name="quantity"
          label="数量"
          placeholder="请输入数量"
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: "请输入数量" }]}
        />
        <ProFormDigit
          name="budget_unit_price"
          label="预算单价"
          placeholder="请输入预算单价"
          fieldProps={{ precision: 2 }}
        />
        <ProFormDigit
          name="budget_total_price"
          label="预算总价"
          placeholder="请输入预算总价"
          fieldProps={{ precision: 2 }}
        />
      </DrawerForm>
    </>
  );
};

export default CreateForm;
