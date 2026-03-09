import { AuditStatus, PhaseNum, WaitStatus } from "@/enum";
import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from "@ant-design/pro-components";
import { cloneElement, useRef, useState } from "react";

const ViewForm = (props) => {
  const { values, trigger, projects, suppliers, contracts, users } = props;
  const formRef = useRef();
  const [open, setOpen] = useState(false);

  return (
    <>
      <DrawerForm
        title="查看材料"
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
        initialValues={{
          ...values,
          related_contract: (() => {
            if (!values.related_contract) return [];
            try {
              // 尝试解析 JSON 数组格式，如 "[4,3]"
              const parsed = JSON.parse(values.related_contract);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              // 如果不是 JSON，按逗号分隔的字符串处理
              return values.related_contract
                .split(",")
                .map((id) => Number(id.trim()));
            }
          })(),
          acceptance_note: values.acceptance_note
            ? [
                {
                  uid: "-1",
                  name: values.acceptance_note.split("/").pop() || "验收说明",
                  status: "done",
                  url: values.acceptance_note,
                },
              ]
            : [],
        }}
        submitter={false}
        readonly
      >
        <ProFormSelect
          name="project_id"
          label="项目名称"
          options={projects}
          readonly
        />
        <ProFormSelect
          name="supplier_unit"
          label="供货单位"
          options={suppliers}
          readonly
          convertValue={(value) => {
            const supplier = suppliers?.find((s) => s.value == value);
            return supplier ? supplier.label : value;
          }}
        />
        <ProFormSelect
          name="phase_num"
          label="期数"
          options={PhaseNum}
          readonly
        />
        <ProFormTextArea name="material_name" label="材料名称" readonly />
        <ProFormText name="unit" label="单位" readonly />
        <ProFormDigit
          name="quantity"
          label="数量"
          readonly
          fieldProps={{
            precision: 2,
          }}
        />
        <ProFormDigit
          name="unit_price"
          label="单价(元)"
          readonly
          fieldProps={{
            precision: 2,
          }}
        />
        <ProFormDigit
          name="total_price"
          label="合价(元)"
          readonly
          fieldProps={{
            precision: 2,
          }}
        />
        <ProFormSelect
          name="related_contract"
          label="关联合同"
          mode="multiple"
          options={contracts}
          readonly
        />
        <ProFormSelect
          name="audit_status"
          label="审核状态"
          options={AuditStatus}
          readonly
        />
        <ProFormSelect
          name="document_status"
          label="单据状态"
          options={WaitStatus}
          readonly
        />
        <ProFormText
          name="handler"
          label="经办人"
          readonly
          convertValue={(value) => {
            const user = users?.find((u) => u.value == value);
            return user ? user.label : value;
          }}
        />
        <ProFormUploadButton
          name="acceptance_note"
          label="验收说明"
          max={1}
          disabled
          fieldProps={{
            name: "files",
            listType: "text",
            showUploadList: {
              showDownloadIcon: true,
              showRemoveIcon: false,
            },
          }}
        />
      </DrawerForm>
    </>
  );
};

export default ViewForm;
