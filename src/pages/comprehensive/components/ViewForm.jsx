import {
  DrawerForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { cloneElement, useRef, useState } from "react";

const ViewForm = (props) => {
  const { values, trigger, projects } = props;
  const formRef = useRef();
  const [open, setOpen] = useState(false);

  return (
    <>
      <DrawerForm
        title="查看综合管理记录"
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
          maskClosable: false,
          keyboard: false,
        }}
        initialValues={{
          ...values,
        }}
        submitter={false}
        readonly
      >
        <ProFormSelect
          name="project_id"
          label="所属项目"
          options={projects}
          readonly
        />
        <ProFormTextArea
          name="project_content"
          label="项目内容"
          readonly
          fieldProps={{
            rows: 4,
          }}
        />
        <ProFormText name="phase_num" label="期数" readonly />
        <ProFormText name="specific_part" label="具体部位" readonly />
      </DrawerForm>
    </>
  );
};

export default ViewForm;
