import { PhaseNum } from "@/enum";
import { updateComprehensive } from "@/services/business";
import {
  DrawerForm,
  ProFormSelect,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { message } from "antd";
import { cloneElement, useEffect, useRef, useState } from "react";

const UpdateForm = (props) => {
  const { onOk, values, trigger, projects } = props;
  const formRef = useRef();
  const [open, setOpen] = useState(false);
  const [budgetOptions, setBudgetOptions] = useState([]);
  const [allBudgetInfo, setAllBudgetInfo] = useState([]);

  // 当打开表单时，加载项目的预算信息
  useEffect(() => {
    if (open && values.project_id) {
      loadProjectBudgetInfo(values.project_id);
    }
  }, [open, values.project_id]);

  const loadProjectBudgetInfo = (projectId) => {
    const project = projects.find((p) => p.value === projectId);
    if (project) {
      const budgetInfo = project.additional_info1
        ? JSON.parse(project.additional_info1)
        : [];

      // 保存完整的预算信息
      setAllBudgetInfo(budgetInfo);

      // 根据当前选择的期数过滤建筑位置
      const currentPhase = values.phase_num;
      if (currentPhase) {
        const filtered = budgetInfo.filter(
          (item) => item.phase_num === currentPhase
        );
        setBudgetOptions(
          filtered.map((item) => ({
            value: item.position,
            label: item.position,
            phase_num: item.phase_num,
          }))
        );
      } else {
        setBudgetOptions(
          budgetInfo.map((item) => ({
            value: item.position,
            label: item.position,
            phase_num: item.phase_num,
          }))
        );
      }
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
        title="编辑综合管理记录"
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
        onFinish={async (value) => {
          const params = {
            ...value,
            comprehensive_id: values.comprehensive_id,
            project_name: projects.find((p) => p.value === value.project_id)
              ?.project_name,
          };
          const res = await updateComprehensive(params);

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
          label="所属项目"
          placeholder="请选择项目"
          options={projects}
          disabled
          rules={[
            {
              required: true,
              message: "请选择项目",
            },
          ]}
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

export default UpdateForm;
