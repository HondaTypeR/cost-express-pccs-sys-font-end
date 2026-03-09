import { EditableProTable } from "@ant-design/pro-components";
import { Modal } from "antd";
import { useEffect, useState } from "react";

const MaterialModal = (props) => {
  const {
    open,
    onCancel,
    phases,
    materialData,
    onSave,
    type = "material",
    readonly = false,
    supplierList = [],
    supplierData,
    onSaveSupplier,
  } = props;
  const [editableKeys, setEditableRowKeys] = useState({});
  const [dataSource, setDataSource] = useState(materialData || {});
  const [supplierEditableKeys, setSupplierEditableRowKeys] = useState({});
  const [supplierDataSource, setSupplierDataSource] = useState(
    supplierData || {}
  );

  useEffect(() => {
    setDataSource(materialData || {});
  }, [materialData, open]);

  useEffect(() => {
    setSupplierDataSource(supplierData || {});
  }, [supplierData, open]);

  const typeConfig = {
    material: { title: "材料信息", nameLabel: "材料名称" },
    machinery: { title: "机械信息", nameLabel: "机械名称" },
    labor: { title: "人工信息", nameLabel: "人工名称" },
    cost: { title: "费用信息", nameLabel: "费用名称" },
  };

  const config = typeConfig[type] || typeConfig.material;

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
      width: 60,
      editable: false,
    },
    {
      title: config.nameLabel,
      dataIndex: "material_name",
      width: 150,
      formItemProps: {
        rules: [
          {
            required: true,
            message: `请输入${config.nameLabel}`,
          },
        ],
      },
    },
    {
      title: "规格型号",
      dataIndex: "specification",
      width: 150,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入规格型号",
          },
        ],
      },
    },
    {
      title: "单位",
      dataIndex: "unit",
      width: 100,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入单位",
          },
        ],
      },
    },
    {
      title: "数量",
      dataIndex: "quantity",
      valueType: "digit",
      width: 120,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入数量",
          },
        ],
      },
    },
    {
      title: "预算单价",
      dataIndex: "budget_unit_price",
      valueType: "digit",
      width: 120,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入预算单价",
          },
        ],
      },
    },
    {
      title: "预算总价",
      dataIndex: "budget_total_price",
      valueType: "digit",
      width: 120,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入预算总价",
          },
        ],
      },
    },
    ...(!readonly
      ? [
          {
            title: "操作",
            valueType: "option",
            width: 150,
            render: (text, record, _, action) => [
              <a
                key="editable"
                onClick={() => action?.startEditable?.(record.id)}
              >
                编辑
              </a>,
              <a
                key="delete"
                onClick={() => {
                  const phase = phases.find((p) => {
                    const phaseData = dataSource[p] || [];
                    return phaseData.some((item) => item.id === record.id);
                  });
                  if (phase) {
                    const newData = (dataSource[phase] || []).filter(
                      (item) => item.id !== record.id
                    );
                    handleDataSourceChange(phase, newData);
                  }
                }}
              >
                删除
              </a>,
            ],
          },
        ]
      : []),
  ];

  const handleOk = async () => {
    const result = await onSave?.(dataSource);
    if (result === false) {
      return;
    }
    onSaveSupplier?.(supplierDataSource);
    onCancel?.();
  };

  const handleDataSourceChange = (phase, newData) => {
    setDataSource((prev) => ({
      ...prev,
      [phase]: newData,
    }));
  };

  const handleEditableKeysChange = (phase, keys) => {
    setEditableRowKeys((prev) => ({
      ...prev,
      [phase]: keys,
    }));
  };

  const handleSupplierDataSourceChange = (phase, newData) => {
    setSupplierDataSource((prev) => ({
      ...prev,
      [phase]: newData,
    }));
  };

  const handleSupplierEditableKeysChange = (phase, keys) => {
    setSupplierEditableRowKeys((prev) => ({
      ...prev,
      [phase]: keys,
    }));
  };

  const supplierColumns = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
      width: 60,
      editable: false,
    },
    {
      title: "供货单位",
      dataIndex: "supplier_id",
      valueType: "select",
      width: 200,
      fieldProps: {
        options: supplierList.map((item) => ({
          label: item.supplier_name,
          value: item.supplier_id,
        })),
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请选择供货单位",
          },
        ],
      },
    },
    {
      title: "材料名称",
      dataIndex: "material_name",
      width: 180,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入材料名称",
          },
        ],
      },
    },
    {
      title: "型号规格",
      dataIndex: "specification",
      width: 180,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入型号规格",
          },
        ],
      },
    },
    {
      title: "单位",
      dataIndex: "unit",
      width: 120,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入单位",
          },
        ],
      },
    },
    {
      title: "数量",
      dataIndex: "quantity",
      valueType: "digit",
      width: 180,
      fieldProps: {
        style: { width: "160px" },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入数量",
          },
        ],
      },
    },
    {
      title: "合同单价",
      dataIndex: "contract_unit_price",
      valueType: "digit",
      width: 180,
      fieldProps: {
        style: { width: "160px" },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入合同单价",
          },
        ],
      },
    },
    {
      title: "合同总价",
      dataIndex: "contract_total_price",
      valueType: "digit",
      width: 180,
      fieldProps: {
        style: { width: "160px" },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入合同总价",
          },
        ],
      },
    },
    {
      title: "供货数量累计",
      dataIndex: "supply_quantity_total",
      valueType: "digit",
      width: 180,
      fieldProps: {
        style: { width: "160px" },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入供货数量累计",
          },
        ],
      },
    },
    {
      title: "实际发生金额",
      dataIndex: "actual_amount",
      valueType: "digit",
      width: 180,
      fieldProps: {
        style: { width: "160px" },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入实际发生金额",
          },
        ],
      },
    },
    ...(!readonly
      ? [
          {
            title: "操作",
            valueType: "option",
            fixed: "right",
            width: 150,
            render: (text, record, _, action) => [
              <a
                key="editable"
                onClick={() => action?.startEditable?.(record.id)}
              >
                编辑
              </a>,
              <a
                key="delete"
                onClick={() => {
                  const phase = phases.find((p) => {
                    const phaseData = supplierDataSource[p] || [];
                    return phaseData.some((item) => item.id === record.id);
                  });
                  if (phase) {
                    const newData = (supplierDataSource[phase] || []).filter(
                      (item) => item.id !== record.id
                    );
                    handleSupplierDataSourceChange(phase, newData);
                  }
                }}
              >
                删除
              </a>,
            ],
          },
        ]
      : []),
  ];

  return (
    <Modal
      title={config.title}
      open={open}
      onCancel={onCancel}
      onOk={readonly ? onCancel : handleOk}
      okText={readonly ? undefined : "确定"}
      cancelText={readonly ? "关闭" : "取消"}
      width={1200}
      destroyOnClose
      maskClosable={false}
      keyboard={false}
      footer={readonly ? null : undefined}
    >
      {phases && phases.length > 0 ? (
        phases.map((phase) => (
          <div key={phase} style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>
              {phase === "1"
                ? "一期"
                : phase === "2"
                ? "二期"
                : phase === "3"
                ? "三期"
                : phase === "4"
                ? "四期"
                : "五期"}
            </h3>
            <EditableProTable
              rowKey="id"
              columns={columns}
              value={dataSource[phase] || []}
              onChange={(newData) => handleDataSourceChange(phase, newData)}
              recordCreatorProps={
                readonly
                  ? false
                  : {
                      position: "bottom",
                      record: () => ({ id: Math.random() }),
                      newRecordType: "dataSource",
                      creatorButtonText: "添加一行",
                    }
              }
              editable={
                readonly
                  ? false
                  : {
                      editableKeys: editableKeys[phase] || [],
                      onChange: (keys) => handleEditableKeysChange(phase, keys),
                    }
              }
              pagination={false}
            />
          </div>
        ))
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
          请先选择期数
        </div>
      )}
    </Modal>
  );
};

export default MaterialModal;
