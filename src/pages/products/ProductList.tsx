import { useState, useEffect } from "react";
import { getProducts, Product, deleteProduct } from "../../api/products";
import { Link, useNavigate } from "react-router-dom";
import { Modal as MuiModal, Box, Button, Typography } from "@mui/material";

// Material-UI Modal 스타일
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
};

function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(
        null
    );

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                setError("상품 목록을 불러오는데 실패했습니다.");
                console.error("상품 목록을 가져오는데 실패했습니다.", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleEdit = (productId: number) => {
        navigate(`/products/edit/${productId}`);
    };

    const handleDeleteClick = (productId: number) => {
        setSelectedProductId(productId);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (selectedProductId) {
            try {
                // 1. API 호출
                await deleteProduct(selectedProductId);
                // 2. 성공 시 처리
                setProducts(
                    products.filter((p) => p.productId !== selectedProductId)
                );
                setIsModalOpen(false);
            } catch (error) {
                // 3. 실패 시 처리
                console.error("상품 삭제 실패:", error);
                setError("상품 삭제 실패");
            }
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <h1>상품 목록</h1>
            <div>
                <Link to="/products/add">상품 등록</Link>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>상품사진</th>
                        <th>상품명</th>
                        <th>상품재고</th>
                        <th>가격</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.productId}>
                            <td>
                                <Link
                                    to={`/products/edit/${product.productId}`}
                                >
                                    <img
                                        src={product.thumbnail}
                                        alt={product.productName}
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                        }}
                                    />
                                </Link>
                            </td>
                            <td>
                                <Link
                                    to={`/products/edit/${product.productId}`}
                                >
                                    {product.productName}
                                </Link>
                            </td>
                            <td>{product.stock}개</td>
                            <td>{product.price.toLocaleString()}원</td>
                            <td>
                                <button
                                    onClick={() =>
                                        handleEdit(product.productId || 0)
                                    }
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() =>
                                        handleDeleteClick(
                                            product.productId || 0
                                        )
                                    }
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Material-UI Modal */}
            <MuiModal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">
                        정말 삭제하시겠습니까?
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                        >
                            삭제
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setIsModalOpen(false)}
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </MuiModal>
        </div>
    );
}

export default ProductList;
