import { PhaseNum } from "@/enum";
import { updateArtificial } from "@/services/business";
import {
  DrawerForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from "@ant-design/pro-components";
import { message } from "antd";
import { cloneElement, useEffect, useRef, useState } from "react";

const UpdateForm = (props) => {
  const { onOk, values, trigger, projects, suppliers, contracts, users } =
    props;
  const formRef = useRef();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(values.quantity || 0);
  const [unitPrice, setUnitPrice] = useState(values.unit_price || 0);
  const [totalPrice, setTotalPrice] = useState(values.total_price || 0);

  useEffect(() => {
    if (open) {
      setQuantity(values.quantity || 0);
      setUnitPrice(values.unit_price || 0);
      setTotalPrice(values.total_price || 0);
      formRef.current?.setFieldsValue({
        total_price: values.total_price || 0,
      });
    }
  }, [open, values]);

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
        title="编辑人工"
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
          related_contract: Number(values.related_contract),
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
        onFinish={async (value) => {
          const selectedProject = projects.find(
            (p) => p.value === value.project_id
          );

          const params = {
            ...value,
            material_code: values.material_code,
            project_name: selectedProject?.label || "",
            related_contract: value.related_contract,
            acceptance_note:
              value.acceptance_note?.[0]?.response?.data?.fileList?.[0]
                ?.fileUrl ||
              value.acceptance_note?.[0]?.url ||
              "",
          };
          const res = await updateArtificial(params);

          if (res.code === 200) {
            message.success(res?.msg || "更新成功");
            setOpen(false);
            onOk?.();
            return true;
          } else {
            message.error(res?.msg || "更新失败");
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
                  material_name: selectedContract.material_name,
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
          convertValue={(value) => {
            const supplier = suppliers?.find((s) => s.value == value);
            return supplier ? supplier.value : value;
          }}
          fieldProps={{
            showSearch: true,
            filterOption: (input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
          }}
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
          label="人工名称"
          placeholder="请输入人工名称"
          rules={[
            {
              required: true,
              message: "请输入人工名称",
            },
          ]}
        />
        <ProFormText
          name="dept"
          label="具体部位"
          placeholder="请输入具体部位"
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
          readonly
          convertValue={(value) => {
            console.log("🚀 ~ UpdateForm ~ users:", users);
            const user = users?.find((u) => u.value == value);

            return user ? user.label : value;
          }}
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

export default UpdateForm;
