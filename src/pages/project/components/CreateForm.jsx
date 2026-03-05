import { PhaseNum, StructureType } from "@/enum.js";
import { addProject } from "@/services/business";
import { supplierList } from "@/services/supplier";
import { PlusOutlined } from "@ant-design/icons";
import {
  DrawerForm,
  EditableProTable,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Divider, Tag, message } from "antd";
import { useEffect, useRef, useState } from "react";
import MaterialModal from "./MaterialModal";

const mock = [
  {
    id: 624748504,
    title: "优化首页加载速度",
    description: "首页白屏时间超过 3s，需优化资源加载",
    status: "open",
    created_at: 1705286400000,
  },
  {
    id: 624691229,
    title: "修复登录超时问题",
    description: "高峰期登录请求超时，需排查连接池",
    status: "closed",
    created_at: 1705200000000,
  },
  {
    id: 624674560,
    title: "新增数据导出功能",
    description: "支持导出 Excel 和 CSV 格式",
    status: "processing",
    created_at: 1705113600000,
  },
];

const CreateForm = (props) => {
  const { reload, companyList } = props;
  const formRef = useRef();
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [machineryModalOpen, setMachineryModalOpen] = useState(false);
  const [laborModalOpen, setLaborModalOpen] = useState(false);
  const [costModalOpen, setCostModalOpen] = useState(false);
  const [materialData, setMaterialData] = useState({});
  const [machineryData, setMachineryData] = useState({});
  const [laborData, setLaborData] = useState({});
  const [costData, setCostData] = useState({});
  const [materialSupplierData, setMaterialSupplierData] = useState({});
  const [machinerySupplierData, setMachinerySupplierData] = useState({});
  const [laborSupplierData, setLaborSupplierData] = useState({});
  const [costSupplierData, setCostSupplierData] = useState({});
  const [selectedPhases, setSelectedPhases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [currentRowId, setCurrentRowId] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const res = await supplierList();
      if (res.code === 200) {
        setSuppliers(res.data || []);
      }
    };
    fetchSuppliers();
  }, []);

  const columns = [
    {
      title: "建筑位置",
      dataIndex: "position",
      key: "position",
      width: 200,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入建筑位置",
          },
        ],
      },
    },
    {
      title: "所属期数",
      dataIndex: "phase_num",
      key: "phase_num",
      valueType: "select",
      width: 150,
      fieldProps: {
        options: selectedPhases.map((phase) => {
          const found = PhaseNum.find((item) => item.value === phase);
          return found || { value: phase, label: phase };
        }),
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请选择所属期数",
          },
        ],
      },
    },
    {
      title: "建筑面积(m²)",
      dataIndex: "area",
      key: "area",
      valueType: "digit",
      width: 180,
      fieldProps: {
        style: { width: "170px" },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入建筑面积",
          },
        ],
      },
    },
    {
      title: "层数(层)",
      dataIndex: "height",
      key: "height",
      valueType: "digit",
      width: 100,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入层数",
          },
        ],
      },
    },
    {
      title: "预算造价(元)",
      dataIndex: "budget_cost",
      key: "budget_cost",
      valueType: "digit",
      width: 210,
      fieldProps: {
        style: { width: "200px" },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "请输入预算造价",
          },
        ],
      },
    },
    {
      title: "操作",
      key: "action",
      valueType: "option",
      fixed: "right",
      width: 360,
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => action?.startEditable?.(record.id)}>
          编辑
        </a>,
        <a key="delete">删除</a>,
        <Tag
          key="material"
          color="blue"
          style={{
            width: "50px",
            cursor: "pointer",
            textAlign: "center",
            marginLeft: "8px",
          }}
          onClick={() => {
            const phases = formRef.current?.getFieldValue("phase_num");
            if (!phases || phases.length === 0) {
              message.warning("请先选择期数");
              return;
            }
            setCurrentRowId(record.id);
            setSelectedPhases(phases);
            setMaterialModalOpen(true);
          }}
        >
          材料
        </Tag>,
        <Tag
          key="machinery"
          color="red"
          style={{ width: "50px", cursor: "pointer", textAlign: "center" }}
          onClick={() => {
            const phases = formRef.current?.getFieldValue("phase_num");
            if (!phases || phases.length === 0) {
              message.warning("请先选择期数");
              return;
            }
            setCurrentRowId(record.id);
            setSelectedPhases(phases);
            setMachineryModalOpen(true);
          }}
        >
          机械
        </Tag>,
        <Tag
          key="labor"
          style={{ width: "50px", cursor: "pointer", textAlign: "center" }}
          onClick={() => {
            const phases = formRef.current?.getFieldValue("phase_num");
            if (!phases || phases.length === 0) {
              message.warning("请先选择期数");
              return;
            }
            setCurrentRowId(record.id);
            setSelectedPhases(phases);
            setLaborModalOpen(true);
          }}
        >
          人工
        </Tag>,
        <Tag
          key="cost"
          style={{ width: "50px", cursor: "pointer", textAlign: "center" }}
          onClick={() => {
            const phases = formRef.current?.getFieldValue("phase_num");
            if (!phases || phases.length === 0) {
              message.warning("请先选择期数");
              return;
            }
            setCurrentRowId(record.id);
            setSelectedPhases(phases);
            setCostModalOpen(true);
          }}
        >
          费用
        </Tag>,
      ],
    },
  ];

  return (
    <>
      <DrawerForm
        title="新建项目"
        formRef={formRef}
        trigger={
          <Button type="primary" icon={<PlusOutlined />}>
            新建
          </Button>
        }
        width="1000px"
        grid={true}
        drawerProps={{
          destroyOnClose: true,
          maskClosable: false,
          keyboard: false,
        }}
        onFinish={async (value) => {
          // 将材料、机械、人工、费用数据合并到每一行的 dataSource 中
          const enrichedDataSource = dataSource.map((row) => ({
            ...row,
            material: materialData[row.id] || {},
            machinery: machineryData[row.id] || {},
            labor: laborData[row.id] || {},
            cost: costData[row.id] || {},
            material_supplier: materialSupplierData[row.id] || {},
            machinery_supplier: machinerySupplierData[row.id] || {},
            labor_supplier: laborSupplierData[row.id] || {},
            cost_supplier: costSupplierData[row.id] || {},
          }));

          const params = {
            ...value,
            phase_num: value?.phase_num?.join(","),
            additional_info1: JSON.stringify(enrichedDataSource),
          };
          const res = await addProject(params);

          if (res.code === 200) {
            message.success(res?.msg);
            reload?.();
            return true;
          } else {
            message.error(res?.msg);
            return false;
          }
        }}
      >
        <>
          <Divider variant="dotted" style={{ borderColor: "#7cb305" }}>
            项目基础信息
          </Divider>
          <ProFormText
            label="项目名称"
            name="project_name"
            colProps={{ span: 12 }}
            rules={[
              {
                required: true,
                message: "请输入项目名称",
              },
            ]}
            placeholder="请输入项目名称"
          />
          <ProFormText
            label="项目地址"
            name="project_address"
            colProps={{ span: 12 }}
            rules={[
              {
                required: true,
                message: "请输入项目地址",
              },
            ]}
            placeholder="请输入项目地址"
          />
          <ProFormText
            label="用地面积"
            name="land_area"
            colProps={{ span: 12 }}
            rules={[
              {
                required: true,
                message: "请输入用地面积",
              },
            ]}
            placeholder="请输入用地面积"
          />
          <ProFormText
            label="容积率"
            name="plot_ratio"
            colProps={{ span: 12 }}
            rules={[
              {
                required: true,
                message: "请输入容积率",
              },
            ]}
            placeholder="请输入容积率"
          />
          <ProFormText
            label="总建筑面积"
            name="total_building_area"
            colProps={{ span: 12 }}
            rules={[
              {
                required: true,
                message: "请输入总建筑面积",
              },
            ]}
            placeholder="请输入总建筑面积"
          />
          <ProFormText
            label="住宅面积"
            name="residential_area"
            colProps={{ span: 12 }}
            rules={[
              {
                required: true,
                message: "请输入住宅面积",
              },
            ]}
            placeholder="请输入住宅面积"
          />
          <ProFormText
            label="商铺面积"
            name="shop_area"
            colProps={{ span: 12 }}
            rules={[
              {
                required: true,
                message: "请输入商铺面积",
              },
            ]}
            placeholder="请输入商铺面积"
          />
          <ProFormText
            label="地下室面积"
            name="basement_area"
            colProps={{ span: 12 }}
            rules={[
              {
                required: true,
                message: "请输入地下室面积",
              },
            ]}
            placeholder="请输入地下室面积"
          />
          <ProFormText
            label="公共面积"
            name="public_area"
            colProps={{ span: 12 }}
            rules={[
              {
                required: true,
                message: "请输入公共面积",
              },
            ]}
            placeholder="请输入公共面积"
          />
          <ProFormText
            label="项目内容"
            name="project_content"
            colProps={{ span: 12 }}
            rules={[
              {
                required: true,
                message: "请输入项目内容",
              },
            ]}
            placeholder="请输入项目内容"
          />
          <ProFormSelect
            label="期数"
            name="phase_num"
            colProps={{ span: 12 }}
            options={PhaseNum}
            mode="multiple"
            rules={[
              {
                required: true,
                message: "请选择期数",
              },
            ]}
            placeholder="请选择期数"
          />
          <ProFormDigit
            colProps={{ span: 12 }}
            label="建筑总面积"
            name="building_total_area"
            min={0}
            rules={[
              {
                required: true,
                message: "请输入建筑总面积",
              },
            ]}
            placeholder="请输入建筑总面积"
            fieldProps={{
              suffix: "m²",
            }}
          />

          <ProFormDigit
            colProps={{ span: 12 }}
            label="预算总造价"
            name="budget_total_cost"
            min={0}
            rules={[
              {
                required: true,
                message: "请输入预算总造价",
              },
            ]}
            placeholder="请输入预算总造价"
            fieldProps={{
              suffix: "元",
            }}
          />
          <div style={{ lineHeight: "90px", marginLeft: "10px" }}>
            <Tag
              color="blue"
              style={{ width: "60px", cursor: "pointer", textAlign: "center" }}
              onClick={() => {
                const phases = formRef.current?.getFieldValue("phase_num");
                if (!phases || phases.length === 0) {
                  message.warning("请先选择期数");
                  return;
                }
                setSelectedPhases(phases);
                setMaterialModalOpen(true);
              }}
            >
              材料
            </Tag>
            <Tag
              color="red"
              style={{ width: "60px", cursor: "pointer", textAlign: "center" }}
              onClick={() => {
                const phases = formRef.current?.getFieldValue("phase_num");
                if (!phases || phases.length === 0) {
                  message.warning("请先选择期数");
                  return;
                }
                setSelectedPhases(phases);
                setMachineryModalOpen(true);
              }}
            >
              机械
            </Tag>
            <Tag
              style={{ width: "60px", cursor: "pointer", textAlign: "center" }}
              onClick={() => {
                const phases = formRef.current?.getFieldValue("phase_num");
                if (!phases || phases.length === 0) {
                  message.warning("请先选择期数");
                  return;
                }
                setSelectedPhases(phases);
                setLaborModalOpen(true);
              }}
            >
              人工
            </Tag>
            <Tag
              style={{ width: "60px", cursor: "pointer", textAlign: "center" }}
              onClick={() => {
                const phases = formRef.current?.getFieldValue("phase_num");
                if (!phases || phases.length === 0) {
                  message.warning("请先选择期数");
                  return;
                }
                setSelectedPhases(phases);
                setCostModalOpen(true);
              }}
            >
              费用
            </Tag>
          </div>
          <ProFormSelect
            label="结构形式"
            name="structure_type"
            colProps={{ span: 12 }}
            options={StructureType}
            rules={[
              {
                required: true,
                message: "请选择结构形式",
              },
            ]}
            placeholder="请选择结构形式"
          />
        </>
        <Divider variant="dotted" style={{ borderColor: "#7cb305" }}>
          项目预算信息
        </Divider>
        <EditableProTable
          style={{ width: "100%" }}
          rowKey="id"
          columns={columns}
          request={async () => ({
            data: [],
            total: 0,
            success: true,
          })}
          value={dataSource}
          onChange={setDataSource}
          recordCreatorProps={{
            position: "bottom",
            record: () => {
              const phases = formRef.current?.getFieldValue("phase_num") || [];
              const newRecord = { id: Math.random() };
              // 如果期数只有一个，自动填充到新行
              if (phases.length === 1) {
                newRecord.phase_num = phases[0];
              }
              return newRecord;
            },
            newRecordType: "dataSource",
          }}
          editable={{
            //type: "multiple",
            editableKeys,
            onChange: setEditableRowKeys,
          }}
        />
      </DrawerForm>
      <MaterialModal
        open={materialModalOpen}
        onCancel={() => setMaterialModalOpen(false)}
        phases={selectedPhases}
        materialData={currentRowId ? materialData[currentRowId] : {}}
        onSave={(data) => {
          if (currentRowId) {
            setMaterialData((prev) => ({ ...prev, [currentRowId]: data }));
          }
        }}
        type="material"
        supplierList={suppliers}
        supplierData={currentRowId ? materialSupplierData[currentRowId] : {}}
        onSaveSupplier={(data) => {
          if (currentRowId) {
            setMaterialSupplierData((prev) => ({
              ...prev,
              [currentRowId]: data,
            }));
          }
        }}
      />
      <MaterialModal
        open={machineryModalOpen}
        onCancel={() => setMachineryModalOpen(false)}
        phases={selectedPhases}
        materialData={currentRowId ? machineryData[currentRowId] : {}}
        onSave={(data) => {
          if (currentRowId) {
            setMachineryData((prev) => ({ ...prev, [currentRowId]: data }));
          }
        }}
        type="machinery"
        supplierList={suppliers}
        supplierData={currentRowId ? machinerySupplierData[currentRowId] : {}}
        onSaveSupplier={(data) => {
          if (currentRowId) {
            setMachinerySupplierData((prev) => ({
              ...prev,
              [currentRowId]: data,
            }));
          }
        }}
      />
      <MaterialModal
        open={laborModalOpen}
        onCancel={() => setLaborModalOpen(false)}
        phases={selectedPhases}
        materialData={currentRowId ? laborData[currentRowId] : {}}
        onSave={(data) => {
          if (currentRowId) {
            setLaborData((prev) => ({ ...prev, [currentRowId]: data }));
          }
        }}
        type="labor"
        supplierList={suppliers}
        supplierData={currentRowId ? laborSupplierData[currentRowId] : {}}
        onSaveSupplier={(data) => {
          if (currentRowId) {
            setLaborSupplierData((prev) => ({ ...prev, [currentRowId]: data }));
          }
        }}
      />
      <MaterialModal
        open={costModalOpen}
        onCancel={() => setCostModalOpen(false)}
        phases={selectedPhases}
        materialData={currentRowId ? costData[currentRowId] : {}}
        onSave={(data) => {
          if (currentRowId) {
            setCostData((prev) => ({ ...prev, [currentRowId]: data }));
          }
        }}
        type="cost"
        supplierList={suppliers}
        supplierData={currentRowId ? costSupplierData[currentRowId] : {}}
        onSaveSupplier={(data) => {
          if (currentRowId) {
            setCostSupplierData((prev) => ({ ...prev, [currentRowId]: data }));
          }
        }}
      />
    </>
  );
};

export default CreateForm;
