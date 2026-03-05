import {
  allListMaterials,
  listProcessRecord,
  listProject,
} from "@/services/business";
import { supplierList } from "@/services/supplier";
import { fetchUser } from "@/services/user";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useModel } from "@umijs/max";
import { useEffect, useRef, useState } from "react";
import PaymentModal from "./components/PaymentModal";
import PaymentRecordModal from "./components/PaymentRecordModal";

const FinanceManagement = () => {
  const { initialState } = useModel("@@initialState");
  const currentUser = initialState?.currentUser;
  const actionRef = useRef(null);
  const [suppliers, setSuppliers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allProcessRecord, setAllProcessRecord] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchProcessRecord = async () => {
    const res = await listProcessRecord();
    if (res.code === 200) {
      setAllProcessRecord(res.data);
    }
  };

  const fetchSuppliers = async () => {
    const res = await supplierList();
    if (res.code === 200) {
      setSuppliers(
        res.data.map((item) => ({
          value: item.supplier_id,
          label: item.supplier_name,
        }))
      );
    }
  };

  const fetchProjects = async () => {
    const res = await listProject();
    if (res.code === 200) {
      setProjects(
        res.data.map((item) => ({
          value: item.project_id,
          label: item.project_name,
        }))
      );
    }
  };

  const fetchUsers = async () => {
    const res = await fetchUser();
    if (res.code === 200) {
      setUsers(
        res.data.map((item) => ({
          value: item.id,
          label: item.nickname || item.username,
        }))
      );
    }
  };

  useEffect(() => {
    fetchProcessRecord();
    fetchSuppliers();
    fetchProjects();
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "供应商",
      dataIndex: "supplier",
      width: 200,
      valueType: "select",
      fieldProps: {
        options: suppliers,
      },
      render: (text, record) => {
        const supplier = suppliers.find((s) => s.value == record.supplier);
        return supplier ? supplier.label : record.supplier;
      },
    },
    {
      title: "归属项目",
      dataIndex: "project_name",
      width: 150,
      valueType: "select",
      fieldProps: {
        options: projects,
        showSearch: true,
        filterOption: (input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
      },
      search: {
        transform: (value) => ({ project_id: value }),
      },
    },
    {
      title: "类型",
      dataIndex: "data_type",
      width: 100,
      valueType: "select",
      valueEnum: {
        material: { text: "材料" },
        mechanical: { text: "机械" },
        artificial: { text: "人工" },
      },
    },
    {
      title: "名称",
      dataIndex: "material_name",
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        if (record?.material_name) {
          return record?.material_name;
        }
        if (record?.machinery_name) {
          return record?.machinery_name;
        }
        if (record?.artificial_name) {
          return record?.artificial_name;
        }
        return "-";
      },
    },
    {
      title: "单位",
      dataIndex: "unit",
      width: 100,
      hideInSearch: true,
    },
    {
      title: "数量",
      dataIndex: "quantity",
      width: 100,
      valueType: "digit",
      hideInSearch: true,
    },
    {
      title: "合同单价",
      dataIndex: "contract_unit_price",
      width: 120,
      valueType: "money",
      hideInSearch: true,
    },
    {
      title: "合同总价",
      dataIndex: "contract_total_price",
      width: 120,
      valueType: "money",
      hideInSearch: true,
    },
    {
      title: "总金额",
      dataIndex: "total_amount",
      width: 120,
      valueType: "money",
      hideInSearch: true,
    },
    {
      title: "待付款金额",
      dataIndex: "wait_account_paid",
      width: 150,
      valueType: "money",
      hideInSearch: true,
    },
    {
      title: "已付款金额",
      dataIndex: "account_paid",
      width: 150,
      valueType: "money",
      hideInSearch: true,
    },
    {
      title: "已关联付款单",
      dataIndex: "payment_code",
      width: 150,
      hideInSearch: true,
      render: (text, record) => {
        const relatedRecords = allProcessRecord.filter(
          (pr) => pr.relation_id === record.code
        );
        const count = relatedRecords.length;
        if (count === 0) return "-";
        return (
          <PaymentRecordModal
            trigger={<a>{count}</a>}
            records={relatedRecords}
            users={users}
            currentUser={currentUser}
            onRefresh={() => {
              fetchProcessRecord();
              actionRef.current?.reload();
            }}
          />
        );
      },
    },
    {
      title: "操作",
      valueType: "option",
      width: 200,
      fixed: "right",
      render: (text, record) => {
        const actions = [];
        actions.push(
          <PaymentModal
            key="payment"
            record={record}
            onOk={() => {
              fetchProcessRecord();
              actionRef.current?.reload();
            }}
            trigger={<a>创建付款单</a>}
          />
        );

        return actions;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="财务管理列表"
        actionRef={actionRef}
        rowKey={(record) => `${record.data_type}-${record.code}`}
        search={{
          labelWidth: 120,
        }}
        request={async (params, sort, filter) => {
          // Remove pagination parameters
          fetchProcessRecord();
          const { current, pageSize, ...queryParams } = params;
          const res = await allListMaterials(queryParams);
          if (res.code === 200) {
            return {
              data: res.data.list || [],
              success: true,
              total: res.data.summary?.totalCount || 0,
            };
          }
          return {
            data: [],
            success: true,
            total: 0,
          };
        }}
        columns={columns}
        scroll={{ x: 1500 }}
      />
    </PageContainer>
  );
};

export default FinanceManagement;
