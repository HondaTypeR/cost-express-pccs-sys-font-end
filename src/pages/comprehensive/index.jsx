import { PhaseNum } from "@/enum";
import {
  deleteComprehensive,
  findImportTasks,
  importBudget,
  listComprehensive,
  listProject,
} from "@/services/business";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import {
  Button,
  message,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
  Upload,
} from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import ViewForm from "./components/ViewForm";

const Comprehensive = () => {
  const actionRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [importOpen, setImportOpen] = useState(false);
  const [importFileList, setImportFileList] = useState([]);
  const [importing, setImporting] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

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

  const handleImportOk = async () => {
    if (!importFileList || importFileList.length === 0) {
      message.warning("请先选择一个 Excel 文件");
      return;
    }
    const fileItem = importFileList[0];
    if (fileItem.status && fileItem.status !== "done") {
      message.warning("文件正在上传，请稍后再试");
      return;
    }
    const uploadedUrl =
      fileItem?.response?.data?.fileList?.[0]?.fileUrl || fileItem?.url;
    if (!uploadedUrl) {
      message.error("未获取到文件地址，请重试");
      return;
    }
    try {
      setImporting(true);
      const res = await importBudget({
        project_id: 8, //TODO 待从项目选择中获取
        fileUrl: uploadedUrl,
      });
      if (res?.code === 200) {
        message.success(res?.msg || "导入任务已提交");
        setImportOpen(false);
        setImportFileList([]);
      } else {
        message.error(res?.msg || "导入失败");
      }
    } catch (e) {
      message.error("导入异常，请稍后重试");
    } finally {
      setImporting(false);
    }
  };

  const handleImportCancel = () => {
    setImportOpen(false);
    setImportFileList([]);
  };

  const fetchImportTasks = async () => {
    try {
      setTasksLoading(true);
      const res = await findImportTasks({});
      if (res?.code === 200) {
        const list = Array.isArray(res?.data) ? res.data : [];
        setTasks(list.slice(0, 50));
      } else {
        message.error(res?.msg || "获取任务失败");
        setTasks([]);
      }
    } catch (e) {
      message.error("获取任务异常，请稍后重试");
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    if (tasksOpen) {
      fetchImportTasks();
    }
  }, [tasksOpen]);

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
          <Button key="import" onClick={() => setImportOpen(true)}>
            导入Excel
          </Button>,
          <Button key="importTasks" onClick={() => setTasksOpen(true)}>
            导入任务
          </Button>,
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
      <Modal
        title="导入Excel"
        open={importOpen}
        onOk={handleImportOk}
        onCancel={handleImportCancel}
        okText="确认导入"
        cancelText="取消"
        confirmLoading={importing}
        destroyOnHidden
      >
        <Upload
          name="files"
          fileList={importFileList}
          multiple={false}
          maxCount={1}
          action="/api/contract/upload"
          beforeUpload={(file) => {
            const name = String(file?.name || "").toLowerCase();
            const type = String(file?.type || "");
            const isExcel =
              name.endsWith(".xls") ||
              name.endsWith(".xlsx") ||
              type === "application/vnd.ms-excel" ||
              type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            if (!isExcel) {
              message.error("仅支持上传 .xls 或 .xlsx 文件");
              return Upload.LIST_IGNORE;
            }
            return true;
          }}
          onChange={({ fileList: newList }) => {
            setImportFileList(newList.slice(-1));
          }}
          onRemove={() => {
            setImportFileList([]);
          }}
          accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          listType="text"
        >
          <Button>选择文件</Button>
        </Upload>
        <div style={{ marginTop: 8, color: "rgba(0,0,0,.45)" }}>
          仅支持 .xls / .xlsx，单次仅上传一个文件。
        </div>
      </Modal>
      <Modal
        title="导入任务"
        open={tasksOpen}
        onCancel={() => setTasksOpen(false)}
        footer={[
          <Button
            key="refresh"
            type="primary"
            loading={tasksLoading}
            onClick={fetchImportTasks}
          >
            刷新
          </Button>,
          <Button key="close" onClick={() => setTasksOpen(false)}>
            关闭
          </Button>,
        ]}
        width={900}
        destroyOnClose
      >
        <Table
          rowKey="task_id"
          loading={tasksLoading}
          dataSource={tasks}
          pagination={false}
          size="small"
          columns={[
            { title: "任务ID", dataIndex: "task_id" },
            {
              title: "状态",
              dataIndex: "status",
              render: (val) => {
                const v = Number(val);
                const map = {
                  1: { text: "导入中", color: "blue" },
                  2: { text: "导入成功", color: "green" },
                  3: { text: "导入失败", color: "red" },
                };
                const item = map[v] || { text: val, color: "default" };
                return <Tag color={item.color}>{item.text}</Tag>;
              },
            },
            { title: "总行数", dataIndex: "total_rows" },
            { title: "已导入行数", dataIndex: "success_rows" },
            {
              title: "结果",
              dataIndex: "message",
              ellipsis: { showTitle: false },
              render: (text) =>
                text ? (
                  <Tooltip title={text}>
                    <span>{text}</span>
                  </Tooltip>
                ) : (
                  "-"
                ),
            },
            {
              title: "文件名称",
              dataIndex: "file_name",
              ellipsis: true,
            },
            {
              title: "创建时间",
              dataIndex: "create_time",
              render: (val) =>
                val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "-",
            },
          ]}
          scroll={{ x: "max-content" }}
        />
      </Modal>
    </PageContainer>
  );
};

export default Comprehensive;
