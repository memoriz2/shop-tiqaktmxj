import axios from "axios";

const API_BASE_URL = "https://shop-spring.onrender.com";

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
        console.log("전송할 데이터:", product); // 요청 데이터 확인
        const response = await axios.post(
            `${API_BASE_URL}/api/products`,
            product
        );
        console.log("응답 데이터:", response.data); // 응답 데이터 확인
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("API 에러:", error.response?.data); // 에러 상세 정보 확인
            throw new Error(
                error.response?.data?.message || "상품 등록에 실패했습니다."
            );
        }
        throw error;
    }
};
