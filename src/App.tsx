import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./pages/products/ProductList";
import "./App.css";
import ProductForm from "./pages/products/ProductForm";

function App() {
    return (
        <Router>
            <div className="admin-layout">
                <header className="admin-header">
                    <h1>관리자 대시보드</h1>
                </header>
                <div className="admin-container">
                    <nav className="admin-sidebar">
                        <ul>
                            <li>
                                <Link to="/">대시보드</Link>
                            </li>
                            <li>
                                <Link to="/products">상품 관리</Link>
                            </li>
                            <li>주문 관리</li>
                            <li>회원 관리</li>
                            <li>설정</li>
                        </ul>
                    </nav>
                    <main className="admin-content">
                        <Routes>
                            <Route path="/products" element={<ProductList />} />
                            <Route
                                path="/"
                                element={
                                    <>
                                        <h2>환영합니다!</h2>
                                        <p>
                                            관리자 대시보드에 오신 것을
                                            환영합니다.
                                        </p>
                                    </>
                                }
                            />
                            <Route path="/products" element={<ProductList />} />
                            <Route
                                path="/products/add"
                                element={<ProductForm />}
                            />
                            <Route
                                path="/products/edit/:productId"
                                element={<ProductForm />}
                            />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;
