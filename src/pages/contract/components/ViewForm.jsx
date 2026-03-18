import {
  DrawerForm,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
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
        <ProFormRadio.Group
          name="contract_type"
          label="合同类型"
          readonly
          options={[
            { label: "非采购合同", value: "1" },
            { label: "采购合同", value: "2" },
          ]}
        />
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
        <ProFormDependency name={["contract_type"]}>
          {({ contract_type }) => {
            if (contract_type === "2") {
              return (
                <ProFormSelect
                  name="party_a"
                  label="甲方"
                  options={suppliers}
                  readonly
                  convertValue={(value) => {
                    const supplier = suppliers?.find((s) => s.value == value);
                    return supplier ? supplier.label : value;
                  }}
                />
              );
            }
            return <ProFormText name="party_a" label="甲方" readonly />;
          }}
        </ProFormDependency>
        <ProFormDependency name={["contract_type"]}>
          {({ contract_type }) => {
            if (contract_type === "2") {
              return <ProFormText name="party_b" label="乙方" readonly />;
            }
            return (
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
            );
          }}
        </ProFormDependency>
        <ProFormDigit
          name="contract_amount"
          label="合同金额"
          fieldProps={{
            precision: 2,
            style: { width: "100%" },
          }}
          readonly
        />
        <ProFormDependency name={["contract_amount"]}>
          {({ contract_amount }) => {
            if (
              contract_amount === undefined ||
              contract_amount === null ||
              contract_amount === 0
            ) {
              return null;
            }
            return (
              <ProFormText
                name="amount_type_display"
                label="核算类型"
                readonly
                fieldProps={{
                  value:
                    contract_amount >= 0
                      ? `核增 ${contract_amount}`
                      : `核减 ${Math.abs(contract_amount)}`,
                }}
              />
            );
          }}
        </ProFormDependency>
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
            { label: "材料", value: "material" },
            { label: "机械", value: "machinery" },
            { label: "包工包料", value: "package" },
            { label: "其他", value: "other" },
          ]}
          readonly
        />
        <ProFormDependency name={["type"]}>
          {({ type }) => {
            if (type === "material" || type === "package") {
              return (
                <ProFormTextArea
                  name="material_name"
                  label="材料名称"
                  readonly
                  fieldProps={{
                    rows: 4,
                  }}
                />
              );
            }
            return null;
          }}
        </ProFormDependency>
        <ProFormDependency name={["type"]}>
          {({ type }) => {
            if (type === "machinery" || type === "package") {
              return (
                <ProFormTextArea
                  name="machinery_name"
                  label="机械名称"
                  readonly
                  fieldProps={{
                    rows: 4,
                  }}
                />
              );
            }
            return null;
          }}
        </ProFormDependency>
        <ProFormDependency name={["type"]}>
          {({ type }) => {
            if (type === "package") {
              return (
                <ProFormTextArea
                  name="people_name"
                  label="人工名称"
                  readonly
                  fieldProps={{
                    rows: 4,
                  }}
                />
              );
            }
            return null;
          }}
        </ProFormDependency>
        <ProFormDependency name={["type"]}>
          {({ type }) => {
            if (type === "other") {
              return (
                <ProFormTextArea
                  name="other_name"
                  label="其他名称"
                  readonly
                  fieldProps={{
                    rows: 4,
                  }}
                />
              );
            }
            return null;
          }}
        </ProFormDependency>
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
