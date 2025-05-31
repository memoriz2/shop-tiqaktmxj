import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    image: string;
};

function ProductList() {
    const [products] = useState<Product[]>([]);
    const navigate = useNavigate();

    const handleEdit = (productId: number) => {
        navigate(`/products/edit/${productId}`);
    };

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
                        <tr key={product.id}>
                            <td>
                                <img src={product.image} alt={product.name} />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.stock}개</td>
                            <td>{product.price.toLocaleString()}원</td>
                            <td>
                                <button onClick={() => handleEdit(product.id)}>
                                    수정
                                </button>
                                <button>삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;
