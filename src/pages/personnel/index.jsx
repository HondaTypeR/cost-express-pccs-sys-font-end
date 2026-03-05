import { Departments, Roles } from "@/enum.js";
import { removeRule } from "@/services/ant-design-pro/api";
import { fetchCompany } from "@/services/company";
import { fetchUser } from "@/services/user.js";
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from "@ant-design/pro-components";
import { useRequest } from "@umijs/max";
import { Drawer, message } from "antd";
import { useEffect, useRef, useState } from "react";
import CreateForm from "./components/CreateForm.jsx";
import UpdateForm from "./components/UpdateForm.jsx";

const Personnel = () => {
  const actionRef = useRef(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  const fetchCompanyList = async () => {
    const res = await fetchCompany();
    const companyList = res.data.map((item) => ({
      value: item.id,
      label: item.company_name,
      department: item.department,
    }));
    setCompanyList(companyList);
  };
  useEffect(() => {
    fetchCompanyList();
  }, []);

  const [messageApi, contextHolder] = message.useMessage();

  const { run: delRun, loading } = useRequest(removeRule, {
    manual: true,
    onSuccess: () => {
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();

      messageApi.success("Deleted successfully and will refresh soon");
    },
    onError: () => {
      messageApi.error("Delete failed, please try again");
    },
  });

  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "所属公司",
      dataIndex: "owner_company",
      render: (text) => companyList.find((item) => item.value === text)?.label,
    },
    {
      title: "所属部门",
      dataIndex: "owner_dept",
      render: (text) => Departments.find((item) => item.value == text)?.label,
    },
    {
      title: "角色",
      dataIndex: "role",
      render: (text) => Roles.find((item) => item.value === text)?.label,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => [
        <UpdateForm
          trigger={<a>编辑</a>}
          key="config"
          onOk={actionRef.current?.reload}
          values={record}
          companyList={companyList}
        />,
      ],
    },
  ];

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  // const handleRemove = useCallback(
  //   async (selectedRows) => {
  //     if (!selectedRows?.length) {
  //       messageApi.warning("请选择删除项");

  //       return;
  //     }

  //     await delRun({
  //       data: {
  //         key: selectedRows.map((row) => row.key),
  //       },
  //     });
  //   },
  //   [delRun, messageApi.warning]
  // );

  return (
    <PageContainer title={false}>
      {contextHolder}
      <ProTable
        actionRef={actionRef}
        rowKey="key"
        search={false}
        toolBarRender={() => [
          <CreateForm
            key="create"
            reload={actionRef.current?.reload}
            companyList={companyList}
          />,
        ]}
        request={fetchUser}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      {/* {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{" "}
              <FormattedMessage
                id="pages.searchTable.item"
                defaultMessage="项"
              />
              &nbsp;&nbsp;
              <span>
                总计{" "}
                {selectedRowsState.reduce(
                  (pre, item) => pre + (item.callNo ?? 0),
                  0
                )}{" "}
                万
              </span>
            </div>
          }
        >
          <Button
            loading={loading}
            onClick={() => {
              handleRemove(selectedRowsState);
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )} */}
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Personnel;
