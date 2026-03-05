import { DefaultFooter } from "@ant-design/pro-components";
import React from "react";

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: "none",
      }}
      copyright="Powered by Ant Desgin"
      links={
        [
          // {
          //   key: "Ant Design",
          //   title: "Ant Design",
          //   href: "https://ant.design",
          //   blankTarget: true,
          // },
        ]
      }
    />
  );
};

export default Footer;
