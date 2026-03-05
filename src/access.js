/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState) {
  const { currentUser, menuData } = initialState || {};

  // 获取所有允许访问的路径
  const allowedPaths = menuData?.map(item => item.path) || [];

  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    // 检查是否有访问某个路由的权限
    canAccessRoute: (route) => {
      // 白名单路由，不需要权限检查
      const whiteList = ['/user/login', '/user/register', '/user/register-result', '/', '/welcome', '/403'];
      if (whiteList.includes(route)) {
        return true;
      }

      // 检查路由是否在允许的路径中
      return allowedPaths.some(path => {
        return route === path || route.startsWith(path + '/');
      });
    },
  };
}
