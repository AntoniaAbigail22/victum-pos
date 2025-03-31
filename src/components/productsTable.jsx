import React, { useState, useEffect } from "react";
import { Tag, notification, Space, Avatar, Button, InputNumber } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { indexProducts, deleteProduct } from "../../api/products/products";
import TableList from "./TableList";

const ProductsTable = ({ storeId = 1 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await indexProducts({
        store: storeId,
        page: currentPage,
        search: searchTerm,
      });

      if (response.status) {
        const formattedProducts =
          response.data?.data.map((product) => ({
            ...product,
            stock: product.quanty_whole,
            utility: product.utility || 0,
          })) || [];

        setProducts(formattedProducts);
        setTotalItems(response.data?.total || 0);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      notification.error({
        message: "Error",
        description: "No se pudieron cargar los productos",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, storeId]);

  const handleDelete = async (id) => {
    try {
      const response = await deleteProduct({ id });
      if (response.status) {
        notification.success({
          message: "Éxito",
          description: "Producto eliminado correctamente",
        });
        fetchProducts();
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      notification.error({
        message: "Error",
        description: "No se pudo eliminar el producto",
      });
    }
  };

  const columns = [
    {
      title: "Imagen",
      dataIndex: "image_url",
      key: "image",
      width: 80,
      render: (image_url) => (
        <Avatar
          src={image_url}
          icon={!image_url && <PictureOutlined />}
          style={{
            backgroundColor: !image_url ? "#1890ff" : "transparent",
            color: !image_url ? "#fff" : "inherit",
          }}
          size="large"
        />
      ),
    },
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Departamento",
      dataIndex: ["category", "name"],
      key: "category",
      render: (categoryName) => categoryName || "Sin categoría",
      width: 150,
    },
    {
      title: "Stock",
      dataIndex: "quanty_whole",
      key: "stock",
      render: (stock) => (
        <InputNumber
          value={stock}
          disabled
          prefix={<ShoppingOutlined />}
          style={{ width: "100%" }}
        />
      ),
      width: 120,
    },
    {
      title: "Precio Costo",
      dataIndex: "price_cost",
      key: "price_cost",
      render: (price) => `$${price?.toFixed(2)}`,
      width: 120,
      align: "right",
    },
    {
      title: "Precio Venta",
      dataIndex: "price_sale",
      key: "price_sale",
      render: (price) => `$${price?.toFixed(2)}`,
      width: 120,
      align: "right",
    },
    {
      title: "Precio Mayor",
      dataIndex: "price_whole",
      key: "price_whole",
      render: (price) => (price ? `$${price?.toFixed(2)}` : "-"),
      width: 120,
      align: "right",
    },
    {
      title: "Utilidad",
      dataIndex: "utility",
      key: "utility",
      render: (utility) => (
        <Tag color={utility >= 0 ? "green" : "red"}>{utility?.toFixed(2)}%</Tag>
      ),
      width: 100,
      align: "right",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EditOutlined />} type="primary" ghost size="small" />
          <Button
            icon={<DeleteOutlined />}
            danger
            size="small"
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
      width: 120,
    },
  ];

  return (
    <TableList
      columns={columns}
      data={products}
      label="Productos"
      loading={loading}
      newItem={true}
      searchItem={setSearchTerm}
      changePage={setCurrentPage}
      search={searchTerm}
      current={currentPage}
      total={totalItems}
    />
  );
};

export default ProductsTable;
