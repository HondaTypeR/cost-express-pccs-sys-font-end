import { PageContainer } from "@ant-design/pro-components";
import BudgetPie from "./Components/BudgetPie";
import CLLine from "./Components/CLLine";
import GYSLine from "./Components/GYSLine";
import JXLine from "./Components/JXLine";
import RGLine from "./Components/RGLine";

const Dashboard = () => {
  return (
    <PageContainer title={false}>
      <div style={{ width: "100%" }}>
        <BudgetPie />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <CLLine />
          <JXLine />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <RGLine />
          <GYSLine />
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
