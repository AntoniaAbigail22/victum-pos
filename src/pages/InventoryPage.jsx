import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Space,
  notification,
  Tag,
  InputNumber,
  Avatar,
} from "antd";
import {
  ExclamationCircleFilled,
  EditOutlined,
  DeleteOutlined,
  InboxOutlined,
  ShoppingOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { Code, useDisclosure } from "@chakra-ui/react";
import TableList from "../components/TableList";
import ModalEditProduct from "../components/ModalEditProduct";
import { openNotification } from "../libs/Extras";
import {
  indexProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  setArchiveProduct,
} from "../api/products/products";
import BreadcrumbHeader from "../components/BreadcrumbHeader";
import BottomMessage from "../components/BottomMessage";

const InventoryPage = () => {
  const [api, contextHolder] = notification.useNotification();
  const sendNotification = (type, description) =>
    openNotification(api, type, description);

  const store = 1;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    price_cost: 0,
    price_sale: 0,
    price_whole: 0,
    quanty_whole: 1,
    mode_sale: 1,
    category_id: null,
    image_url: null,
    utility: 0,
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [isChecked, setIsChecked] = useState("false");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDelete, setProductDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getProducts();
  }, [page, search, isChecked]);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await indexProducts({
        store,
        page,
        search,
        archive: isChecked === "true",
      });

      if (response?.status) {
        setData(response?.data?.data);
        setTotal(response?.data?.total);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      sendNotification("error", "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await createProduct({
        product: formData,
        store_id: store,
      });

      if (response.status) {
        sendNotification("success", "Producto creado correctamente");
        onClose();
        getProducts();
        resetForm();
      }
    } catch (error) {
      console.error("Error al crear producto:", error);
      sendNotification("error", "Error al crear producto");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await updateProduct({
        id: selectedProduct,
        product: formData,
        store_id: store,
      });

      if (response.status) {
        sendNotification("success", "Producto actualizado correctamente");
        onClose();
        getProducts();
        resetForm();
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      sendNotification("error", "Error al actualizar producto");
    }
  };

  const handleArchive = async ({ id, archive }) => {
    try {
      const response = await setArchiveProduct({ id, archive });
      if (response.status) {
        sendNotification(
          "success",
          archive ? "Producto archivado" : "Producto activado"
        );
        getProducts();
      }
    } catch (error) {
      console.error("Error al archivar producto:", error);
      sendNotification("error", "Error al archivar producto");
    }
  };

  const handleDelete = async ({ id }) => {
    try {
      const response = await deleteProduct({ id });
      if (response.status) {
        sendNotification("success", "Producto eliminado correctamente");
        getProducts();
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      sendNotification("error", "Error al eliminar producto");
    }
  };

  const handleModal = (id, mode) => {
    if (id) {
      const item = data.find((item) => item?.id === id);
      setProductDelete(item);
      setIsModalOpen(true);
      setIsDelete(mode);
    }
  };

  const handleEdit = (record) => {
    setSelectedProduct(record?.id);
    setProduct(record);
    setFormData({
      code: record.code || "",
      description: record.description || "",
      price_cost: record.price_cost || 0,
      price_sale: record.price_sale || 0,
      price_whole: record.price_whole || 0,
      quanty_whole: record.quanty_whole || 1,
      mode_sale: record.mode_sale || 1,
      category_id: record.category_id || null,
      image_url: record.image_url || null,
      utility: record.utility || 0,
    });
    onOpen();
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      price_cost: 0,
      price_sale: 0,
      price_whole: 0,
      quanty_whole: 1,
      mode_sale: 1,
      category_id: null,
      image_url: null,
      utility: 0,
    });
    setSelectedProduct(null);
  };

  const label = "Productos";
  const links = [{ href: "/inventory", label: "Inventario" }, { label: label }];

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
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
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
      align: "right",
    },
    {
      title: "Acciones",
      key: "action",
      width: 120,
      render: (record) => (
        <Space size="small">
          <Button
            type="default"
            icon={record?.archive ? <DeleteOutlined /> : <InboxOutlined />}
            onClick={() => handleModal(record?.id, record?.archive)}
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col p-2">
      {contextHolder}
      <BreadcrumbHeader isChecked={isChecked} links={links} label={label} />

      <TableList
        columns={columns}
        data={data}
        label={label}
        loading={loading}
        newItem={true}
        searchItem={setSearch}
        search={search}
        changePage={setPage}
        current={page}
        total={total}
        selectedProvider={selectedProduct}
        setSelectedProvider={setSelectedProduct}
        onOpen={() => {
          resetForm();
          onOpen();
        }}
        setProvider={setProduct}
        isOpen={isOpen}
        deleteItem={(id) => handleModal(id, true)}
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
      />

      <ModalEditProduct
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetForm();
        }}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        product={product}
        setProduct={setProduct}
        formData={formData}
        setFormData={setFormData}
        addProduct={handleAddProduct}
        updateProduct={handleUpdateProduct}
        categories={categories}
      />

      <Modal
        title={
          <span>
            <ExclamationCircleFilled
              style={{ color: "#faad14", marginRight: 8 }}
            />
            ¿{isDelete ? "Eliminar" : "Archivar"} producto?
          </span>
        }
        open={isModalOpen}
        onOk={() => {
          isDelete
            ? handleDelete({ id: productDelete?.id })
            : handleArchive({
                id: productDelete?.id,
                archive: !productDelete?.archive,
              });
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
        centered
        okType={isDelete ? "danger" : "primary"}
        okText={isDelete ? "Eliminar" : "Archivar"}
      >
        <div className="px-6">
          <p>
            {`${
              isDelete
                ? "¿Estás seguro de eliminar el producto"
                : "¿Desea archivar el producto"
            } `}
            <Code fontWeight="bold" colorScheme="blackAlpha">
              {productDelete?.description}
            </Code>
            ?
            {isDelete && (
              <>
                <br /> Esta acción no se puede deshacer.
              </>
            )}
          </p>
        </div>
        <BottomMessage>
          <Code fontWeight="bold" colorScheme="blackAlpha">
            Esc
          </Code>{" "}
          para cerrar ventana
        </BottomMessage>
      </Modal>
    </div>
  );
};

export default InventoryPage;
