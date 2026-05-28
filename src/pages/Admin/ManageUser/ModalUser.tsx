import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Radio } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { DataType } from "./ListUser";

interface IProps {
  isShowCreate: boolean;
  onCancel: () => void;
  onRefesh: () => void;
  isShowEdit: boolean;
  onCanEdit: () => void;
  data?: DataType;
}

interface IForm {
  username: string;
  phone: string;
  password: string;
  re_password: string;
  role: string;
}

const ModalUser: React.FC<IProps> = ({
  isShowCreate,
  onCancel,
  onRefesh,
  onCanEdit,
  isShowEdit,
  data,
}) => {
  const Cookie = require("js-cookie");
  const token = Cookie.get("access_token");
  const [form] = Form.useForm();

  useEffect(() => {
    if (isShowEdit && data) {
      form.setFieldsValue({
        name: data?.username, // giả sử `name` dùng `username` hiện tại
        username: data?.username,
        phone: data?.phone,
      });
    } else {
      form.resetFields();
    }
  }, [isShowEdit, data, form]);

  const userInfoRaw = localStorage.getItem("user_info");
  const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;

  const handleCreateForSuperAdmin = async (value: IForm) => {
    if (value.password === value.re_password) {
      try {
        const createUser = await axios
          .post(
            `${process.env.REACT_APP_URL_API}/users`,
            {
              username: value.username,
              password: value.password,
              phone: value.phone,
              role: value.role === "r_admin"
                  ? "ADMIN"
                  : "USER",
            },
            {
              headers: {
                Authorization: `Bearer ${token} `,
                accept: "*/*",
              },
            }
          )
          .then((data) => {
            if (data.status === 201) {
              onCancel();
              Swal.fire({
                icon: "success",
                title: "Tạo tài khoản thành công",
                text: "Vui lòng đợi ít phút. ",
                timer: 1000,
                timerProgressBar: true,
                customClass: {
                  popup: "custom-swal",
                  title: "custom-title",
                },
              });
              onRefesh();
            }
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Lỗi đăng ký",
              text: `${err.response.data.message}`,
              timer: 1000,
              timerProgressBar: true,
              customClass: {
                popup: "custom-swal",
                title: "custom-title",
              },
            });
          });
      } catch (error) {
        return error;
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu không trùng khớp",
        text: "Vui lòng đợi ít phút. ",
        timer: 1000,
        timerProgressBar: true,
        customClass: {
          popup: "custom-swal",
          title: "custom-title",
        },
      });
    }
  };

  const handleCreateForAdmin = async (value: IForm) => {
    if (value.password === value.re_password) {
      try {
        const createUser = await axios
          .post(
            `${process.env.REACT_APP_URL_API}/auth/register`,
            {
              username: value.username,
              password: value.password,
              phone: value.phone,
              managedByUsername: userInfo.userName,
            },
            {
              headers: {
                Authorization: `Bearer ${token} `,
                accept: "*/*",
              },
            }
          )
          .then((data) => {
            if (data.status === 201) {
              onCancel();
              Swal.fire({
                icon: "success",
                title: "Tạo tài khoản thành công",
                text: "Vui lòng đợi ít phút. ",
                timer: 1000,
                timerProgressBar: true,
                customClass: {
                  popup: "custom-swal",
                  title: "custom-title",
                },
              });
              onRefesh();
            }
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Lỗi đăng ký",
              text: `${err.response.data.message}`,
              timer: 1000,
              timerProgressBar: true,
              customClass: {
                popup: "custom-swal",
                title: "custom-title",
              },
            });
          });
      } catch (error) {
        return error;
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu không trùng khớp",
        text: "Vui lòng đợi ít phút. ",
        timer: 1000,
        timerProgressBar: true,
        customClass: {
          popup: "custom-swal",
          title: "custom-title",
        },
      });
    }
  };
  let functionHandleCreate = userInfo.role === "ADMIN" ? handleCreateForAdmin : handleCreateForSuperAdmin;

  const handleEdit = async (value: IForm) => {
    try {
      await axios
        .put(
          `${process.env.REACT_APP_URL_API}/users/${data?._id}`,
          {
            username: value.username,
            phone: value.phone,
            password: value.password,
          },
          {
            headers: {
              Authorization: `Bearer ${token} `,
              accept: "*/*",
            },
          }
        )
        .then((data) => {
          if (data.status === 200) {
            onCanEdit();
            Swal.fire({
              icon: "success",
              title: "Cập nhật tài khoản thành công",
              text: "Vui lòng đợi ít phút. ",
              timer: 1000,
              timerProgressBar: true,
              customClass: {
                popup: "custom-swal",
                title: "custom-title",
              },
            });
            onRefesh();
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Lỗi ",
            text: `${err.response.data.message}`,
            timer: 1000,
            timerProgressBar: true,
            customClass: {
              popup: "custom-swal",
              title: "custom-title",
              htmlContainer: "custom-text",
            },
          });
        });
    } catch (error) {
      return error;
    }
  };
  const handleClose = () => {
    onCanEdit();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="admin-modal__head">
          <h2 className="admin-modal__head-title">
            {isShowEdit ? "Sửa tài khoản" : "Tạo tài khoản"}
          </h2>
          <p className="admin-modal__head-sub">
            {isShowEdit
              ? "Cập nhật thông tin đăng nhập của người dùng"
              : "Thêm người dùng mới vào hệ thống"}
          </p>
        </div>
      }
      open={isShowCreate || isShowEdit}
      onCancel={handleClose}
      footer={null}
      centered
      width={480}
      destroyOnClose
      wrapClassName="admin-modal admin-modal--user"
    >
      <Form
        className="admin-modal__form"
        layout="vertical"
        requiredMark="optional"
        initialValues={{ role: "r_user" }}
        onFinish={isShowCreate ? functionHandleCreate : handleEdit}
        form={form}
      >
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
        >
          <Input size="large" placeholder="vd: player01" autoComplete="username" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            { pattern: /^[0-9]{10}$/, message: "Số điện thoại gồm 10 chữ số" },
          ]}
        >
          <Input size="large" maxLength={10} placeholder="09xxxxxxxx" inputMode="numeric" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={
            isShowCreate
              ? [{ required: true, message: "Vui lòng nhập mật khẩu" }]
              : undefined
          }
        >
          <Input.Password
            size="large"
            placeholder={isShowEdit ? "Để trống nếu không đổi" : "Tối thiểu 6 ký tự"}
            autoComplete="new-password"
          />
        </Form.Item>
        {isShowCreate ? (
          <Form.Item
            label="Nhập lại mật khẩu"
            name="re_password"
            rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu" }]}
          >
            <Input.Password size="large" placeholder="Nhập lại mật khẩu" autoComplete="new-password" />
          </Form.Item>
        ) : null}

        {userInfo?.role === "SUPERADMIN" && isShowCreate ? (
          <Form.Item label="Quyền hạn" name="role" className="admin-modal__role-item">
            <Radio.Group className="admin-modal__role-group" optionType="button" buttonStyle="solid">
              <Radio.Button value="r_admin">Admin</Radio.Button>
              <Radio.Button value="r_user">User</Radio.Button>
            </Radio.Group>
          </Form.Item>
        ) : null}

        <div className="admin-modal__footer">
          <Button type="default" className="admin-modal__cancel" onClick={handleClose}>
            Đóng
          </Button>
          <Button type="primary" className="admin-modal__submit" htmlType="submit">
            {isShowEdit ? "Cập nhật" : "Tạo tài khoản"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalUser;
