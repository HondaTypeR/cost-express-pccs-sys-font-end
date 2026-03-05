import { AuditStatus, PhaseNum, WaitStatus } from "@/enum";
import {
  approveMaterial,
  deleteMaterial,
  listContract,
  listMaterial,
  listProject,
  rejectMaterial,
  submitApproval,
} from "@/services/business";
import { supplierList } from "@/services/supplier";
import { fetchUser } from "@/services/user";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useModel } from "@umijs/max";
import { Button, message, Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";
import ApprovalModal from "./Components/ApprovalModal";
import CreateForm from "./Components/CreateForm";
import FinalAuditModal from "./Components/FinalAuditModal";
import ReviewApprovalModal from "./Components/ReviewApprovalModal";
import UpdateForm from "./Components/UpdateForm";
import ViewForm from "./Components/ViewForm";

const MaterialManagement = () => {
  const { initialState } = useModel("@@initialState");
  const currentUser = initialState?.currentUser;
  const actionRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [users, setUsers] = useState([]);

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

  const fetchContracts = async () => {
    const res = await listContract();
    if (res.code === 200) {
      setContracts(
        res.data.map((item) => ({
          value: item.contract_id,
          label: `${item.project_name} (${item.contract_id})`,
          ...item,
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
    fetchProjects();
    fetchSuppliers();
    fetchContracts();
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "项目名称",
      dataIndex: "project_id",
      width: 200,
      valueType: "select",
      fieldProps: {
        options: projects,
      },
    },
    {
      title: "供货单位",
      dataIndex: "supplier_unit",
      width: 200,
      valueType: "select",
      fieldProps: {
        options: suppliers,
      },
      render: (text, record) => {
        const supplier = suppliers.find((s) => s.value == record.supplier_unit);
        return supplier ? supplier.label : record.supplier_unit;
      },
    },
    {
      title: "期数",
      dataIndex: "phase_num",
      width: 120,
      valueType: "select",
      fieldProps: {
        options: PhaseNum,
      },
      render: (text, record) => {
        if (!record.phase_num) return "-";
        const found = PhaseNum.find((item) => item.value === record.phase_num);
        return found ? found.label : record.phase_num;
      },
    },
    {
      title: "材料名称",
      dataIndex: "material_name",
      width: 200,
    },
    {
      title: "单位",
      dataIndex: "unit",
      width: 100,
    },
    {
      title: "数量",
      dataIndex: "quantity",
      width: 120,
      valueType: "digit",
    },
    {
      title: "单价(元)",
      dataIndex: "unit_price",
      width: 120,
      valueType: "money",
    },
    {
      title: "合价(元)",
      dataIndex: "total_price",
      width: 150,
      valueType: "money",
      hideInSearch: true,
    },
    {
      title: "已付款金额",
      dataIndex: "account_paid",
      valueType: "money",
      width: 150,
      hideInSearch: true,
    },
    {
      title: "未付款金额",
      dataIndex: "wait_account_paid",
      valueType: "money",
      width: 150,
      hideInSearch: true,
    },
    {
      title: "关联合同",
      dataIndex: "related_contract",
      width: 200,
      hideInSearch: true,
      render: (text, record) => {
        if (!record.related_contract) return "-";
        const contract = contracts.find(
          (c) => c.value == record.related_contract
        );
        return contract ? contract.label : record.related_contract;
      },
    },
    {
      title: "审核状态",
      dataIndex: "audit_status",
      width: 120,
      valueType: "select",
      fieldProps: {
        options: AuditStatus,
      },
      render: (text, record) => {
        const found = AuditStatus.find(
          (item) => item.value === record.audit_status
        );
        return found ? found.label : "-";
      },
    },
    {
      title: "单据状态",
      dataIndex: "document_status",
      width: 120,
      valueType: "select",
      fieldProps: {
        options: WaitStatus,
      },
      render: (text, record) => {
        return record?.document_status_text || "-";
      },
    },
    {
      title: "经办人",
      dataIndex: "handler",
      width: 120,
      render: (text, record) => {
        const user = users.find((u) => u.value == record.handler);
        return user ? user.label : record.handler;
      },
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      valueType: "dateTime",
      width: 180,
      hideInSearch: true,
    },
    {
      title: "操作",
      valueType: "option",
      width: 200,
      fixed: "right",
      render: (text, record) => {
        const actions = [
          <ViewForm
            key="view"
            values={record}
            trigger={<a>查看</a>}
            projects={projects}
            suppliers={suppliers}
            contracts={contracts}
            users={users}
          />,
        ];

        // 只有状态为草稿时，显示编辑、删除和发起审批按钮
        if (record.document_status === 0) {
          actions.push(
            <UpdateForm
              key="edit"
              values={record}
              onOk={() => actionRef.current?.reload()}
              trigger={<a>编辑</a>}
              projects={projects}
              suppliers={suppliers}
              contracts={contracts}
              users={users}
            />
          );

          // 只有当前登录用户是经办人时，显示发起审批按钮
          if (currentUser?.id == record.handler) {
            actions.push(
              <ApprovalModal
                key="approval"
                trigger={<a>发起审批</a>}
                users={users}
                currentStatus={record.document_status}
                onOk={async (reviewerId) => {
                  const res = await submitApproval({
                    material_code: record.material_code,
                    document_status: record.document_status + 1,
                    user_id: reviewerId,
                  });
                  if (res.code === 200) {
                    message.success(res?.msg || "审批发起成功");
                    actionRef.current?.reload();
                    return true;
                  } else {
                    message.error(res?.msg || "审批发起失败");
                    return false;
                  }
                }}
              />
            );
          }

          actions.push(
            <Popconfirm
              key="delete"
              title="确认删除"
              description="确定要删除这条材料记录吗？删除后无法恢复。"
              onConfirm={async () => {
                const res = await deleteMaterial({
                  material_code: record.material_code,
                });
                if (res.code === 200) {
                  message.success(res?.msg || "删除成功");
                  actionRef.current?.reload();
                } else {
                  message.error(res?.msg || "删除失败");
                }
              }}
              okText="确认"
              cancelText="取消"
            >
              <a key="delete">删除</a>
            </Popconfirm>
          );
        }

        // 如果审核状态是待审核且单据状态是复核审核中，且当前用户是审批人，显示复审审批按钮
        if (
          record.document_status === 1 &&
          record.reviewer == currentUser?.id
        ) {
          actions.push(
            <ReviewApprovalModal
              key="review-approval"
              trigger={<a>复审审批</a>}
              users={users}
              onOk={async (approvalStatus, approvalOpinion, user_id) => {
                let res;
                if (approvalStatus === 1) {
                  // 审批通过
                  res = await approveMaterial({
                    material_code: record.material_code,
                    mark: approvalOpinion,
                    user_id: user_id,
                  });
                } else if (approvalStatus === 2) {
                  // 审批驳回
                  res = await rejectMaterial({
                    material_code: record.material_code,
                    mark: approvalOpinion,
                    user_id: currentUser.id,
                  });
                }

                if (res?.code === 200) {
                  message.success(res?.msg || "审批成功");
                  actionRef.current?.reload();
                  return true;
                } else {
                  message.error(res?.msg || "审批失败");
                  return false;
                }
              }}
            />
          );
        }

        // 如果审核状态是审核通过且单据状态是终审审核中，且当前用户是审核人，显示终审审核按钮
        if (record.document_status === 2 && record.auditor == currentUser?.id) {
          actions.push(
            <FinalAuditModal
              key="final-audit"
              trigger={<a>终审审核</a>}
              onOk={async (approvalStatus, approvalOpinion) => {
                let res;
                if (approvalStatus === 1) {
                  // 审核通过
                  res = await approveMaterial({
                    material_code: record.material_code,
                    approval_note: approvalOpinion,
                    user_id: currentUser?.id,
                  });
                } else if (approvalStatus === 2) {
                  // 审核驳回
                  res = await rejectMaterial({
                    material_code: record.material_code,
                    reject_note: approvalOpinion,
                    user_id: currentUser?.id,
                  });
                }

                if (res?.code === 200) {
                  message.success(res?.msg || "审核成功");
                  actionRef.current?.reload();
                  return true;
                } else {
                  message.error(res?.msg || "审核失败");
                  return false;
                }
              }}
            />
          );
        }

        return actions;
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="材料管理列表"
        actionRef={actionRef}
        rowKey="material_code"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <CreateForm
            key="create"
            onOk={() => actionRef.current?.reload()}
            trigger={
              <Button type="primary" key="primary">
                新建材料
              </Button>
            }
            projects={projects}
            suppliers={suppliers}
            contracts={contracts}
          />,
        ]}
        request={async (params, sort, filter) => {
          const res = await listMaterial({
            ...params,
            page: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: res.data || [],
            success: res.code === 200,
            total: res.total || 0,
          };
        }}
        columns={columns}
        scroll={{ x: 1600 }}
      />
    </PageContainer>
  );
};

export default MaterialManagement;
