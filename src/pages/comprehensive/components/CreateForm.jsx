import { PhaseNum } from "@/enum";
import { addComprehensive } from "@/services/business";
import {
  DrawerForm,
  ProFormSelect,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { message } from "antd";
import { cloneElement, useRef, useState } from "react";

const CreateForm = (props) => {
  const { onOk, trigger, projects } = props;
  const formRef = useRef();
  const [open, setOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [budgetOptions, setBudgetOptions] = useState([]);
  const [allBudgetInfo, setAllBudgetInfo] = useState([]);

  // 当选择项目时，获取项目的预算信息和期数
  const handleProjectChange = async (projectId) => {
    setSelectedProjectId(projectId);

    if (!projectId) {
      setBudgetOptions([]);
      return;
    }

    const project = projects.find((p) => p.value === projectId);
    if (project) {
      // 从 additional_info1 解析预算信息
      const budgetInfo = project.additional_info1
        ? JSON.parse(project.additional_info1)
        : [];

      // 保存完整的预算信息
      setAllBudgetInfo(budgetInfo);

      // 初始时显示所有建筑位置
      setBudgetOptions(
        budgetInfo.map((item) => ({
          value: item.position,
          label: item.position,
          phase_num: item.phase_num,
        }))
      );
    }
  };

  // 当选择期数时，过滤具体部位选项
  const handlePhaseChange = (phaseNum) => {
    if (!phaseNum) {
      // 如果没有选择期数，显示所有建筑位置
      setBudgetOptions(
        allBudgetInfo.map((item) => ({
          value: item.position,
          label: item.position,
          phase_num: item.phase_num,
        }))
      );
    } else {
      // 根据选择的期数过滤建筑位置
      const filtered = allBudgetInfo.filter(
        (item) => item.phase_num === phaseNum
      );
      setBudgetOptions(
        filtered.map((item) => ({
          value: item.position,
          label: item.position,
          phase_num: item.phase_num,
        }))
      );
    }
    // 清空具体部位的选择
    formRef.current?.setFieldsValue({ specific_part: undefined });
  };

  return (
    <>
      <DrawerForm
        title="新建综合管理记录"
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
        onFinish={async (value) => {
          const params = {
            ...value,
            project_name: projects.find((p) => p.value === value.project_id)
              ?.project_name,
          };
          const res = await addComprehensive(params);

          if (res.code === 200) {
            message.success(res?.msg || "创建成功");
            setOpen(false);
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
          label="所属项目"
          placeholder="请选择项目"
          options={projects}
          rules={[
            {
              required: true,
              message: "请选择项目",
            },
          ]}
          fieldProps={{
            onChange: handleProjectChange,
          }}
        />
        <ProFormTextArea
          name="project_content"
          label="项目内容"
          placeholder="请输入项目内容"
          fieldProps={{
            rows: 4,
          }}
          rules={[
            {
              required: true,
              message: "请输入项目内容",
            },
          ]}
        />
        <ProFormSelect
          name="phase_num"
          label="期数"
          placeholder="请选择期数"
          options={PhaseNum}
          fieldProps={{
            onChange: handlePhaseChange,
          }}
          rules={[
            {
              required: true,
              message: "请选择期数",
            },
          ]}
        />
        <ProFormSelect
          name="specific_part"
          label="具体部位"
          placeholder="请选择具体部位"
          options={budgetOptions}
          rules={[
            {
              required: true,
              message: "请选择具体部位",
            },
          ]}
        />
      </DrawerForm>
    </>
  );
};

export default CreateForm;
