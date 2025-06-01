import axios from "axios";

const API_BASE_URL = "https://aladin-chat-server.onrender.com";

export interface Product {
    productId: number | null;
    productName: string;
    price: number;
    stock: number;
    productPhoto: string[];
    description: string;
}

export const createProduct = async (product: Omit<Product, "productId">) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/products`,
            product
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "상품 등록에 실패했습니다."
            );
        }
        throw error;
    }
};
