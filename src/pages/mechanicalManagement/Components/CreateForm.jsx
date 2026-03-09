import { PhaseNum } from "@/enum";
import { addMechanical } from "@/services/business";
import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from "@ant-design/pro-components";
import { useModel } from "@umijs/max";
import { message } from "antd";
import { cloneElement, useRef, useState } from "react";

const CreateForm = (props) => {
  const { onOk, trigger, projects, suppliers, contracts } = props;
  const { initialState } = useModel("@@initialState");
  const currentUser = initialState?.currentUser;
  const formRef = useRef();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // 计算合价
  const calculateTotalPrice = (qty, price) => {
    const total = (qty || 0) * (price || 0);
    setTotalPrice(total);
    formRef.current?.setFieldsValue({ total_price: total });
  };

  const handleQuantityChange = (value) => {
    setQuantity(value || 0);
    calculateTotalPrice(value || 0, unitPrice);
  };

  const handleUnitPriceChange = (value) => {
    setUnitPrice(value || 0);
    calculateTotalPrice(quantity, value || 0);
  };

  return (
    <>
      <DrawerForm
        title="新建机械"
        formRef={formRef}
        open={open}
        trigger={cloneElement(trigger, {
          onClick: () => {
            setOpen(true);
            // 自动填充经办人为当前登录用户ID
            setTimeout(() => {
              formRef.current?.setFieldsValue({
                handler: currentUser?.id || "",
                audit_status: 0, // 默认待审核
                document_status: 0, // 默认草稿
              });
            }, 100);
          },
        })}
        width="600px"
        drawerProps={{
          onClose: () => {
            setOpen(false);
            setQuantity(0);
            setUnitPrice(0);
            setTotalPrice(0);
          },
          destroyOnClose: true,
        }}
        onFinish={async (value) => {
          const selectedProject = projects.find(
            (p) => p.value === value.project_id
          );

          const params = {
            ...value,
            project_name: selectedProject?.label || "",
            acceptance_note:
              value.acceptance_note?.[0]?.response?.data?.fileList?.[0]
                ?.fileUrl ||
              value.acceptance_note?.[0]?.url ||
              "",
          };
          const res = await addMechanical(params);

          if (res.code === 200) {
            message.success(res?.msg || "创建成功");
            setOpen(false);
            setQuantity(0);
            setUnitPrice(0);
            setTotalPrice(0);
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
          label="项目名称"
          placeholder="请选择项目"
          options={projects}
          rules={[
            {
              required: true,
              message: "请选择项目",
            },
          ]}
        />
        <ProFormSelect
          name="related_contract"
          label="关联合同"
          placeholder="请选择关联合同"
          options={contracts}
          fieldProps={{
            showSearch: true,
            filterOption: (input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
            onChange: (value) => {
              const selectedContract = contracts?.find(
                (c) => c.value === value
              );
              if (selectedContract) {
                formRef.current?.setFieldsValue({
                  supplier_unit: Number(selectedContract.party_b_id),
                  phase_num: selectedContract.term,
                  material_name: selectedContract.machinery_name,
                });
              }
            },
          }}
        />
        <ProFormSelect
          name="supplier_unit"
          label="供货单位"
          placeholder="请选择供货单位"
          options={suppliers}
          rules={[
            {
              required: true,
              message: "请选择供货单位",
            },
          ]}
        />
        <ProFormSelect
          name="phase_num"
          label="期数"
          placeholder="请选择期数"
          options={PhaseNum}
          rules={[
            {
              required: true,
              message: "请选择期数",
            },
          ]}
        />
        <ProFormText
          name="material_name"
          label="机械名称"
          placeholder="请输入机械名称"
          rules={[
            {
              required: true,
              message: "请输入机械名称",
            },
          ]}
        />
        <ProFormText
          name="unit"
          label="单位"
          placeholder="请输入单位"
          rules={[
            {
              required: true,
              message: "请输入单位",
            },
          ]}
        />
        <ProFormDigit
          name="quantity"
          label="数量"
          placeholder="请输入数量"
          fieldProps={{
            precision: 2,
            onChange: handleQuantityChange,
          }}
          rules={[
            {
              required: true,
              message: "请输入数量",
            },
          ]}
        />
        <ProFormDigit
          name="unit_price"
          label="单价(元)"
          placeholder="请输入单价"
          fieldProps={{
            precision: 2,
            onChange: handleUnitPriceChange,
          }}
          rules={[
            {
              required: true,
              message: "请输入单价",
            },
          ]}
        />
        <ProFormDigit
          name="total_price"
          label="合价(元)"
          placeholder="自动计算"
          readonly
          fieldProps={{
            precision: 2,
          }}
        />
        <ProFormText
          name="handler"
          label="经办人"
          placeholder="当前登录用户"
          readonly
          hidden
          rules={[
            {
              required: true,
              message: "经办人不能为空",
            },
          ]}
        />
        <ProFormUploadButton
          name="acceptance_note"
          label="验收说明"
          max={1}
          fieldProps={{
            name: "files",
            listType: "text",
            showUploadList: {
              showDownloadIcon: true,
              showRemoveIcon: true,
              showPreviewIcon: true,
            },
            onChange: (info) => {
              if (info.file.status === "done") {
                const fileUrl =
                  info.file.response?.data?.fileList?.[0]?.fileUrl;
                if (fileUrl) {
                  info.file.url = fileUrl;
                }
              }
            },
            onPreview: (file) => {
              window.open(
                file.url || file.response?.data?.fileList?.[0]?.fileUrl,
                "_blank"
              );
            },
          }}
          action="/api/contract/upload"
        />
      </DrawerForm>
    </>
  );
};

export default CreateForm;
