export interface ListItem {
  id: string;
  avatar: string;
  // 通知的标题内容
  title: string;
  // 是否在标题上显示删除线
  titleDelete?: boolean;
  datetime: string;
  type: string;
  read?: boolean;
  description: string;
  clickClose?: boolean;
  extra?: string;
  color?: string;
}

export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
  unreadlist?: ListItem[];
}

export const tabListData: TabItem[] = [
  {
    key: '1',
    name: 'Kế hoạch',
    list: [
      {
        id: '000000001',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
        title: 'Bạn đã nhận được 14 kế hoạch mới',
        description: '',
        datetime: '2024-08-09',
        type: '1',
      },
      {
        id: '000000002',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
        title: 'Kế hoạch của bạn đã được duyệt qua vòng ba',
        description: '',
        datetime: '2024-08-08',
        type: '1',
      },
      {
        id: '000000003',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
        title: 'Mẫu này có thể phân loại các loại kế hoạch khác nhau',
        description: '',
        datetime: '2024-08-07',
        type: '1',
      },
      {
        id: '000000004',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Biểu tượng bên trái để phân biệt các loại kế hoạch khác nhau',
        description: '',
        datetime: '2024-08-07',
        type: '1',
      },
      {
        id: '000000005',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title:
          'Tiêu đề có thể thiết lập tự động hiển thị dấu chấm lửng nếu vượt quá độ dài quy định',
        description: '',
        datetime: '2024-08-07',
        type: '1',
      },
      {
        id: '000000006',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Biểu tượng bên trái để phân biệt các loại kế hoạch khác nhau',
        description: '',
        datetime: '2024-08-07',
        type: '1',
      },
      {
        id: '000000007',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Biểu tượng bên trái để phân biệt các loại kế hoạch khác nhau',
        description: '',
        datetime: '2024-08-07',
        type: '1',
      },
      {
        id: '000000008',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Biểu tượng bên trái để phân biệt các loại kế hoạch khác nhau',
        description: '',
        datetime: '2024-08-07',
        type: '1',
      },
      {
        id: '000000009',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Biểu tượng bên trái để phân biệt các loại kế hoạch khác nhau',
        description: '',
        datetime: '2024-08-07',
        type: '1',
      },
      {
        id: '000000010',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Biểu tượng bên trái để phân biệt các loại kế hoạch khác nhau',
        description: '',
        datetime: '2024-08-07',
        type: '1',
      },
    ],
  },
  {
    key: '2',
    name: 'Sản xuất',
    list: [
      {
        id: '000000006',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Quá trình sản xuất đã hoàn thành',
        description: 'Sản xuất đã hoàn thành với các thông tin chi tiết',
        datetime: '2024-08-07',
        type: '2',
        clickClose: true,
      },
      {
        id: '000000007',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Bạn có bình luận mới từ quản lý sản xuất',
        description: 'Bình luận về quá trình sản xuất vừa qua',
        datetime: '2024-08-07',
        type: '2',
        clickClose: true,
      },
      {
        id: '000000008',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
        title: 'Tiêu đề sản xuất',
        description:
          'Quá trình sản xuất đang diễn ra, hãy kiểm tra để biết thêm thông tin chi tiết về các giai đoạn tiếp theo.',
        datetime: '2024-08-07',
        type: '2',
        clickClose: true,
      },
    ],
  },
  {
    key: '3',
    name: 'Vận chuyển',
    list: [
      {
        id: '000000009',
        avatar: '',
        title: 'Chuẩn bị giao hàng',
        description: 'Hàng cần được chuẩn bị và vận chuyển trước 20:00 ngày 2024-01-12',
        datetime: '',
        extra: 'Chưa bắt đầu',
        color: '',
        type: '3',
      },
      {
        id: '000000010',
        avatar: '',
        title: 'Giao hàng khẩn cấp',
        description: 'Phải hoàn thành giao hàng trước ngày 2024-01-07',
        datetime: '',
        extra: 'Sắp hết hạn',
        color: 'red',
        type: '3',
      },
      {
        id: '000000011',
        avatar: '',
        title: 'Kiểm tra an ninh vận chuyển',
        description: 'Hoàn thành kiểm tra trước ngày 2024-01-09',
        datetime: '',
        extra: 'Đã qua 8 ngày',
        color: 'gold',
        type: '3',
      },
      {
        id: '000000012',
        avatar: '',
        title: 'Xuất xưởng phiên bản ABCD',
        description: 'Hoàn thành vận chuyển trước ngày 2024-01-09',
        datetime: '',
        extra: 'Đang tiến hành',
        color: 'blue',
        type: '3',
      },
    ],
  },
];
