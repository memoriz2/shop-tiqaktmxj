import { useState, useEffect } from "react";
import { getProducts, Product } from "../../api/products";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { Modal as MuiModal, Box, Button, Typography } from "@mui/material";

// React Modal 스타일
const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        borderRadius: "8px",
    },
};

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

    // React Modal 상태
    const [isReactModalOpen, setIsReactModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(
        null
    );

    // Material-UI Modal 상태
    const [isMuiModalOpen, setIsMuiModalOpen] = useState(false);

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

    // React Modal 삭제 처리
    const handleDeleteWithReactModal = (productId: number) => {
        setSelectedProductId(productId);
        setIsReactModalOpen(true);
    };

    // Material-UI Modal 삭제 처리
    const handleDeleteWithMuiModal = (productId: number) => {
        setSelectedProductId(productId);
        setIsMuiModalOpen(true);
    };

    const handleDelete = async () => {
        if (selectedProductId) {
            try {
                // TODO: 삭제 API 호출
                setProducts(
                    products.filter((p) => p.productId !== selectedProductId)
                );
                setIsReactModalOpen(false);
                setIsMuiModalOpen(false);
            } catch (error) {
                console.error("상품 삭제 실패:", error);
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
                                <img
                                    src={product.productPhoto[0]}
                                    alt={product.productName}
                                />
                            </td>
                            <td>{product.productName}</td>
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
                                        handleDeleteWithReactModal(
                                            product.productId || 0
                                        )
                                    }
                                >
                                    React Modal로 삭제
                                </button>
                                <button
                                    onClick={() =>
                                        handleDeleteWithMuiModal(
                                            product.productId || 0
                                        )
                                    }
                                >
                                    MUI Modal로 삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* React Modal */}
            <Modal
                isOpen={isReactModalOpen}
                onRequestClose={() => setIsReactModalOpen(false)}
                style={customStyles}
            >
                <h2>정말 삭제하시겠습니까?</h2>
                <div
                    style={{ display: "flex", gap: "10px", marginTop: "20px" }}
                >
                    <button onClick={handleDelete}>삭제</button>
                    <button onClick={() => setIsReactModalOpen(false)}>
                        취소
                    </button>
                </div>
            </Modal>

            {/* Material-UI Modal */}
            <MuiModal
                open={isMuiModalOpen}
                onClose={() => setIsMuiModalOpen(false)}
            >
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
                            onClick={() => setIsMuiModalOpen(false)}
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
