import { PhaseNum } from "@/enum";
import {
  deleteComprehensive,
  listComprehensive,
  listProject,
} from "@/services/business";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import ViewForm from "./components/ViewForm";

const Comprehensive = () => {
  const actionRef = useRef(null);
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const res = await listProject();
    if (res.code === 200) {
      setProjects(
        res.data.map((item) => ({
          value: item.project_id,
          label: item.project_name,
          project_name: item.project_name,
          additional_info1: item.additional_info1,
        }))
      );
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const columns = [
    {
      title: "所属项目",
      dataIndex: "project_id",
      width: 200,
      valueType: "select",
      fieldProps: {
        options: projects,
      },
    },
    {
      title: "项目内容",
      dataIndex: "project_content",
      width: 300,
      ellipsis: true,
    },
    {
      title: "期数",
      dataIndex: "phase_num",
      width: 150,
      render: (text, record) => {
        if (!record.phase_num) return "-";
        const phases = record.phase_num.split(",").map((p) => p.trim());
        const phaseLabels = phases.map((phase) => {
          const found = PhaseNum.find((item) => item.value === phase);
          return found ? found.label : phase;
        });
        return phaseLabels.join("、");
      },
    },
    {
      title: "具体部位",
      dataIndex: "specific_part",
      width: 200,
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
      render: (text, record) => [
        <ViewForm
          key="view"
          values={record}
          trigger={<a>查看</a>}
          projects={projects}
        />,
        <UpdateForm
          key="edit"
          values={record}
          onOk={() => actionRef.current?.reload()}
          trigger={<a>编辑</a>}
          projects={projects}
        />,
        <Popconfirm
          key="delete"
          title="确认删除"
          description="确定要删除这条综合管理记录吗？删除后无法恢复。"
          onConfirm={async () => {
            const res = await deleteComprehensive({
              comprehensive_id: record.comprehensive_id,
            });
            if (res.code === 200) {
              message.success("删除成功");
              actionRef.current?.reload();
            } else {
              message.error(res.msg || "删除失败");
            }
          }}
          okText="确认"
          cancelText="取消"
          okType="danger"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="综合管理列表"
        actionRef={actionRef}
        rowKey="comprehensive_id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <CreateForm
            key="create"
            onOk={() => actionRef.current?.reload()}
            trigger={
              <Button type="primary" key="primary">
                新建记录
              </Button>
            }
            projects={projects}
          />,
        ]}
        request={async (params, sort, filter) => {
          const res = await listComprehensive({
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
        scroll={{ x: 1400 }}
      />
    </PageContainer>
  );
};

export default Comprehensive;
