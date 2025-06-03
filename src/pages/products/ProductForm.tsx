import { useState } from "react";
// import { uploadImage } from '../../api/upload'; // 백엔드 API 준비되면 주석 해제
import styles from "./ProductForm.module.css";
import CloudinaryUploadButton from "../../components/CloudinaryUploadButton";
import { createProduct } from "../../api/products";

type Product = {
    productId: number | null;
    productName: string;
    price: number | "";
    stock: number | "";
    productPhoto: string[];
    description: string;
    thumbnail: string;
};

const INITIAL_PRODUCT: Product = {
    productId: null,
    productName: "",
    price: "",
    stock: "",
    productPhoto: [],
    description: "",
    thumbnail: "",
};

function ProductForm() {
    const [product, setProduct] = useState<Product>(INITIAL_PRODUCT);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    type CloudinaryInfo = { secure_url: string };
    const handleCloudinaryUpload = (
        info: CloudinaryInfo | CloudinaryInfo[]
    ) => {
        const urls = Array.isArray(info)
            ? info.map((img) => img.secure_url)
            : [info.secure_url];
        setPreviewUrls((prev) => [...prev, ...urls]);
        setProduct((prev) => ({
            ...prev,
            productPhoto: [...prev.productPhoto, ...urls],
        }));
    };

    const handleThumbnailUpload = (info: CloudinaryInfo | CloudinaryInfo[]) => {
        if (!Array.isArray(info)) {
            setProduct((prev) => ({
                ...prev,
                thumbnail: info.secure_url,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            // 유효성 검사
            if (!product.productName.trim()) {
                throw new Error("상품명을 입력해주세요");
            }
            if (product.price === "" || Number(product.price) <= 0) {
                throw new Error("가격을 올바르게 입력해주세요");
            }
            if (product.stock === "" || Number(product.stock) < 0) {
                throw new Error("재고를 올바르게 입력해주세요");
            }

            // TODO: API 호출 로직 추가
            // console.log("제출된 데이터:", product);
            await createProduct({
                productName: product.productName,
                price: Number(product.price),
                stock: Number(product.stock),
                productPhoto: product.productPhoto,
                thumbnail: product.thumbnail,
                description: product.description,
            });

            // 성공 시 폼 초기화
            handleCancel();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "오류가 발생했습니다"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setProduct(INITIAL_PRODUCT);
        setPreviewUrls([]);
        setError("");
    };

    return (
        <div className={styles.form}>
            <h2 className={styles.formTitle}>상품 등록</h2>
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
                            onChange={(e) =>
                                setProduct({
                                    ...product,
                                    productName: e.target.value,
                                })
                            }
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
                            onChange={(e) =>
                                setProduct({
                                    ...product,
                                    price:
                                        e.target.value === ""
                                            ? ""
                                            : Number(e.target.value),
                                })
                            }
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
                            onChange={(e) =>
                                setProduct({
                                    ...product,
                                    stock:
                                        e.target.value === ""
                                            ? ""
                                            : Number(e.target.value),
                                })
                            }
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
                            onChange={(e) =>
                                setProduct({
                                    ...product,
                                    description: e.target.value,
                                })
                            }
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
                            <CloudinaryUploadButton
                                onUpload={handleThumbnailUpload}
                                buttonText="썸네일 이미지 업로드"
                                multiple={false}
                            />
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
                        {isSubmitting ? "저장 중..." : "저장"}
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
