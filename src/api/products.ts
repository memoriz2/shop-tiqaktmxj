import axios from "axios";

const API_BASE_URL = "https://shop-spring.onrender.com";

export interface Product {
    productId: number | null;
    productName: string;
    price: number;
    stock: number;
    productPhoto: Array<{
        url: string;
        filename: string;
    }>;
    thumbnail: string; // 대표 이미지 URL
    thumbnailName: string; // 대표 이미지 원본 파일명
    photoName: string[]; // 상품 이미지 원본 파일명 배열
    description: string;
}

export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        return response.data;
    } catch (error) {
        console.error("상품 목록 조회 실패:", error);
        throw error;
    }
};

export const createProduct = async (product: Omit<Product, "productId">) => {
    try {
        console.log("전송할 데이터:", product); // 요청 데이터 확인
        const response = await axios.post(
            `${API_BASE_URL}/api/products`,
            product,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                withCredentials: true, // 쿠키/인증 정보 포함
            }
        );
        console.log("응답 데이터:", response.data); // 응답 데이터 확인
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("API 에러:", error.response?.data); // 에러 상세 정보 확인
            console.error("요청 설정:", {
                url: `${API_BASE_URL}/api/products`,
                method: "POST",
                headers: error.config?.headers,
                data: product,
            });
            throw new Error(
                error.response?.data?.message || "상품 등록에 실패했습니다."
            );
        }
        throw error;
    }
};

export const deleteProduct = async (productId: number) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/api/products/${productId}`,
            {
                headers: {
                    Accept: "application/json",
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("API 에러:", error.response?.data);
            throw new Error(
                error.response?.data?.message || "상품 삭제에 실패했습니다."
            );
        }
        throw error;
    }
};
