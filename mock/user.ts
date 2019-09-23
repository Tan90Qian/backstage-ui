import Mock from 'mockjs';

export default function UserMock() {
  Mock.mock('/Api/User/currentUser', {
    code: 1,
    msg: '成功',
    data: {
      name: 'Admin',
    },
  });

  Mock.mock('/Api/User/login', {
    code: 1,
    msg: '成功',
    data: {
      authority: 'user',
    },
  });

  Mock.mock('/Api/User/logout', {
    code: 1,
    msg: '成功',
    data: null,
  });
}
