import React, { useState } from "react";
import { Button, Form, Input, message, Card } from "antd";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} es requerido!",
  types: {
    email: "${label} no es un correo válido!",
  },
};

interface ProveedorFormProps {
  onSuccess?: () => void;
}

const ProveedorForm: React.FC<ProveedorFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      let headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        name: values.user.name,
        phone: values.user.phone,
        email: values.user.email,
        store_id: 1,
        company: values.user.company,
        id_asiggned_me: values.user.id_asiggned_me,
      });

      let response = await fetch(
        "https://melody-back-sigma.vercel.app/api/provider/",
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );

      let data = await response.text();
      console.log(data);

      if (response.status === 201) {
        message.success("Proveedor registrado exitosamente");
        onSuccess?.();
      } else {
        message.error("Error al registrar el proveedor");
      }
    } catch (error: any) {
      console.error("Error en la solicitud:", error);

      if (error.response?.data?.message?.includes("duplicate key value")) {
        message.error("El email o teléfono ya está registrado.");
      } else {
        message.error("Error al registrar el proveedor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Registro de Proveedores"
      style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}
    >
      <Form
        {...layout}
        name="register-provider"
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={["user", "name"]}
          label="Nombre"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["user", "phone"]}
          label="Teléfono"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={["user", "email"]}
          label="Email"
          rules={[{ type: "email", required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name={["user", "store_id"]} label="ID de Tienda">
          <Input />
        </Form.Item>

        <Form.Item name={["user", "company"]} label="Empresa">
          <Input />
        </Form.Item>

        <Form.Item name={["user", "id_asiggned_me"]} label="ID Asignado">
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? "Enviando..." : "Registrar"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProveedorForm;
