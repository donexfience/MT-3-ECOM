import React, { useState } from "react";
import { Modal } from "../../components/Modal";
import { AddProductForm } from "../../components/product/AddProduct";
import { AddCategoryForm } from "../../components/category/AddCategory";
import { AddSubcategoryForm } from "../../components/SubCategory/AddSubCategory";

const Product: React.FC = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modal: any) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-x-4">
        <button
          onClick={() => openModal("product")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
        <button
          onClick={() => openModal("category")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Category
        </button>
        <button
          onClick={() => openModal("subcategory")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Subcategory
        </button>
      </div>

      <Modal isOpen={activeModal === "product"} onClose={closeModal}>
        <AddProductForm onClose={closeModal} />
      </Modal>
      <Modal isOpen={activeModal === "category"} onClose={closeModal}>
        <AddCategoryForm onClose={closeModal} />
      </Modal>
      <Modal isOpen={activeModal === "subcategory"} onClose={closeModal}>
        <AddSubcategoryForm onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default Product;
