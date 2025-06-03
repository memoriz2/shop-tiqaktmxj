import { useEffect, useState } from "react";
import styles from "./ProductForm.module.css";
import CloudinaryUploadButton from "../../components/CloudinaryUploadButton";
import { createProduct, Product, updateProduct } from "../../api/products";
import { useParams, useNavigate } from "react-router-dom";
const { productId } = useParams();
import { getProductById } from "../../api/products";

type CloudinaryInfo = {
    secure_url: string;
    original_filename: string;
};

const INITIAL_PRODUCT: Product = {
    productId: null,
    productName: "",
    price: 0,
    stock: 0,
    productPhoto: [],
    thumbnail: "",
    thumbnailName: "",
    photoName: [],
    description: "",
};

function ProductForm() {
    const [product, setProduct] = useState<Product>(INITIAL_PRODUCT);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const [isSubmitting] = useState(false);
    const isEdit = productId;
    const navigate = useNavigate();

    const handleRemoveImage = (index: number) => {
        setPreviewUrls((prev) => {
            const newUrls = [...prev];
            URL.revokeObjectURL(newUrls[index]); // 메모리 누수 방지
            return newUrls.filter((_, i) => i !== index);
        });
        setProduct((prev) => ({
            ...prev,
            productPhoto: prev.productPhoto.filter((_, i) => i !== index),
        }));
    };

    const handleCloudinaryUpload = (
        info: CloudinaryInfo | CloudinaryInfo[]
    ) => {
        const images = Array.isArray(info) ? info : [info];
        const newImages = images.map((img) => ({
            url: img.secure_url,
            filename: img.original_filename,
        }));

        setPreviewUrls((prev) => [
            ...prev,
            ...images.map((img) => img.secure_url),
        ]);
        setProduct((prev) => ({
            ...prev,
            productPhoto: [...prev.productPhoto, ...newImages],
            photoName: [
                ...prev.photoName,
                ...images.map((img) => img.original_filename),
            ],
        }));
    };

    const handleThumbnailUpload = (info: CloudinaryInfo | CloudinaryInfo[]) => {
        if (!Array.isArray(info)) {
            setProduct((prev) => ({
                ...prev,
                thumbnail: info.secure_url,
                thumbnailName: info.original_filename,
            }));
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]:
                name === "price" || name === "stock" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!product.productName || product.price <= 0 || product.stock < 0) {
            alert("모든 필드를 올바르게 입력해주세요.");
            return;
        }

        try {
            if (isEdit) {
                await updateProduct(productId, product);
                alert("상품이 성공적으로 수정되었습니다.");
            } else {
                await createProduct(product);
                alert("상품이 성공적으로 등록되었습니다.");
            }
            setProduct(INITIAL_PRODUCT);
            setPreviewUrls([]);
            navigate("/products");
        } catch (error) {
            console.error("상품 등록 실패:", error);
            alert("상품 등록에 실패했습니다.");
        }
    };

    const handleCancel = () => {
        setProduct(INITIAL_PRODUCT);
        setPreviewUrls([]);
        setError("");
    };

    useEffect(() => {
        if (isEdit) {
            // 상품 정보 불러오기
            const fetchProduct = async () => {
                const data = await getProductById(productId);
                setProduct(data);
            };
            fetchProduct();
        }
    }, [isEdit, productId]);

    return (
        <div className={styles.form}>
            <h2 className={styles.formTitle}>
                {isEdit ? "상품 수정" : "상품 등록"}
            </h2>
            {error && <div className={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className={styles.formList}>
                    <div className={styles.formItem}>
                        <label
                            htmlFor="productName"
                            className={styles.formLabel}
                        >
                            상품명
                        </label>
                        <input
                            type="text"
                            id="productName"
                            name="productName"
                            value={product.productName}
                            onChange={handleInputChange}
                            className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label htmlFor="price" className={styles.formLabel}>
                            가격
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={product.price}
                            onChange={handleInputChange}
                            placeholder="가격"
                            required
                            className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label htmlFor="stock" className={styles.formLabel}>
                            재고
                        </label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={product.stock}
                            onChange={handleInputChange}
                            placeholder="재고"
                            required
                            className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label
                            htmlFor="description"
                            className={styles.formLabel}
                        >
                            설명
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={product.description}
                            onChange={handleInputChange}
                            className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.formLabel}>
                            썸네일 이미지
                        </label>
                        <div className={styles.formInput}>
                            {product.thumbnail && (
                                <div className={styles.thumbnailPreview}>
                                    <img
                                        src={product.thumbnail}
                                        alt="썸네일 미리보기"
                                        className={styles.thumbnailImage}
                                    />
                                </div>
                            )}
                            <div className={styles.thumbnailInput}>
                                <input
                                    type="text"
                                    value={product.thumbnailName}
                                    onChange={handleInputChange}
                                    placeholder="썸네일 이미지 원본 파일명"
                                    className={styles.formInput}
                                />
                                <CloudinaryUploadButton
                                    onUpload={handleThumbnailUpload}
                                    buttonText="썸네일 이미지 업로드"
                                    multiple={false}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.formItem}>
                        <label className={styles.formLabel}>상품 이미지</label>
                        <div className={styles.formInput}>
                            <div className={styles.imagePreview}>
                                {previewUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        className={styles.previewItem}
                                    >
                                        <img
                                            src={url}
                                            alt={`미리보기 ${index + 1}`}
                                            className={styles.previewImage}
                                        />
                                        <div
                                            style={{
                                                fontSize: "12px",
                                                marginTop: "4px",
                                                textAlign: "center",
                                            }}
                                        >
                                            {
                                                product.productPhoto[index]
                                                    ?.filename
                                            }
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveImage(index)
                                            }
                                            className={styles.removeButton}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <CloudinaryUploadButton
                                onUpload={handleCloudinaryUpload}
                                buttonText="상품 이미지 업로드"
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.buttonGroup}>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isEdit ? "수정" : isSubmitting ? "저장 중..." : "저장"}
                    </button>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;
