import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Switch } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { GameScreenLinkRow } from "./ListGameScreenLinks";

interface IProps {
  isShowCreate: boolean;
  onCancel: () => void;
  onRefesh: () => void;
  isShowEdit: boolean;
  onCanEdit: () => void;
  data?: GameScreenLinkRow;
}

interface IForm {
  gameId: string;
  gameName: string;
  screenUrl: string;
  isDefault: boolean;
}

const ModalGameScreenLink: React.FC<IProps> = ({
  isShowCreate,
  onCancel,
  onRefesh,
  onCanEdit,
  isShowEdit,
  data,
}) => {
  const Cookie = require("js-cookie");
  const token = Cookie.get("access_token");
  const [form] = Form.useForm<IForm>();

  useEffect(() => {
    if (isShowEdit && data) {
      form.setFieldsValue({
        gameId: data.gameId,
        gameName: data.gameName,
        screenUrl: data.screenUrl,
        isDefault: data.isDefault,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ isDefault: false });
    }
  }, [isShowEdit, data, form]);

  const handleSubmit = async (values: IForm) => {
    const payload = {
      gameId: values.gameId.trim(),
      gameName: values.gameName?.trim() ?? "",
      screenUrl: values.screenUrl.trim(),
      isDefault: Boolean(values.isDefault),
    };

    try {
      if (isShowEdit && data?._id) {
        await axios.put(
          `${process.env.REACT_APP_URL_API}/game-screen-links/${data._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          }
        );
      } else {
        await axios.post(`${process.env.REACT_APP_URL_API}/game-screen-links`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });
      }

      Swal.fire({
        icon: "success",
        title: isShowEdit ? "Cập nhật thành công" : "Tạo cấu hình thành công",
        timer: 900,
        showConfirmButton: false,
        customClass: { popup: "custom-swal" },
      });
      onCancel();
      onCanEdit();
      onRefesh();
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : "Không thể lưu cấu hình";
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: message,
        customClass: { popup: "custom-swal" },
      });
    }
  };

  return (
    <Modal
      title={isShowEdit ? "Sửa link màn hình game" : "Thêm link màn hình game"}
      open={isShowCreate || isShowEdit}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      wrapClassName="admin-modal"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Game ID"
          name="gameId"
          rules={[{ required: true, message: "Nhập gameId (vd: Mongo _id hoặc default)" }]}
        >
          <Input placeholder="vd: 674abc123... hoặc default" disabled={isShowEdit} />
        </Form.Item>
        <Form.Item label="Tên game (tuỳ chọn)" name="gameName">
          <Input placeholder="Wild Bounty Showdown" />
        </Form.Item>
        <Form.Item
          label="Link màn hình"
          name="screenUrl"
          rules={[{ required: true, message: "Nhập URL game" }]}
        >
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item label="Dùng làm link mặc định" name="isDefault" valuePropName="checked">
          <Switch className="admin-modal__switch" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block className="admin-modal__submit">
          Lưu
        </Button>
      </Form>
    </Modal>
  );
};

export default ModalGameScreenLink;
