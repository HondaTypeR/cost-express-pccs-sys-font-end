import { Button, Result } from 'antd';
import { history } from '@umijs/max';

const NoFoundPage = () => (
  <Result
    status="403"
    title="403"
    subTitle="抱歉，您没有权限访问此页面。"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回首页
      </Button>
    }
  />
);

export default NoFoundPage;
