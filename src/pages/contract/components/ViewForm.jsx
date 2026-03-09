import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { cloneElement, useRef, useState } from "react";

const ViewForm = (props) => {
  const { values, trigger, suppliers, projects } = props;
  const formRef = useRef();
  const [open, setOpen] = useState(false);

  return (
    <>
      <DrawerForm
        title="查看合同"
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
        initialValues={{
          ...values,
          party_b_id: values.party_b_id || values.party_b,
        }}
        submitter={false}
        readonly
      >
        <ProFormText
          name="project_id"
          label="归属项目"
          readonly
          convertValue={(value) => {
            const project = projects.find((p) => p.value == value);
            return project ? project.label : value;
          }}
        />
        <ProFormText name="project_name" label="合同名称" readonly />
        <ProFormText name="party_a" label="甲方" readonly />
        <ProFormSelect
          name="party_b_id"
          label="乙方"
          options={suppliers}
          readonly
          convertValue={(value) => {
            const supplier = suppliers?.find((s) => s.value == value);
            return supplier ? supplier.label : value;
          }}
        />
        <ProFormDigit
          name="contract_amount"
          label="合同金额"
          fieldProps={{
            precision: 2,
            style: { width: "100%" },
          }}
          readonly
        />
        <ProFormSelect
          name="term"
          label="期限"
          options={[
            { label: "一期", value: "1" },
            { label: "二期", value: "2" },
            { label: "三期", value: "3" },
            { label: "四期", value: "4" },
            { label: "五期", value: "5" },
          ]}
          readonly
        />
        <ProFormTextArea
          name="project_content"
          label="项目内容"
          fieldProps={{
            rows: 4,
          }}
          readonly
        />
        <ProFormSelect
          name="type"
          label="类型"
          options={[
            { label: "人工", value: "labor" },
            { label: "材料", value: "material" },
            { label: "机械", value: "machinery" },
            { label: "包工包料", value: "package" },
            { label: "其他", value: "other" },
          ]}
          readonly
        />
        <ProFormText name="material_name" label="材料名称" readonly />
        <ProFormText name="machinery_name" label="机械名称" readonly />
        {values.contract_attachment && (
          <ProFormText label="合同附件">
            <a
              href={values.contract_attachment}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看附件
            </a>
          </ProFormText>
        )}
      </DrawerForm>
    </>
  );
};

export default ViewForm;
