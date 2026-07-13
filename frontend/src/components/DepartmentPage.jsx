import React from 'react';
import ProductList from './ProductList';

function DepartmentPage({ departmentId, title }) {
    return (
        <div className="container-fluid px-lg-5 mt-4">
            {/* 1. Department Header Banner */}
            <div className="row justify-content-center text-center mb-4">
                <div className="col-12">
                    <div className="glass-panel p-4 mb-2">
                        <h2 className="text-main fw-bold m-0">
                            <span className="text-accent">{title}</span> Collection
                        </h2>
                        <p className="text-muted m-0 mt-1">
                            Browse through our handpicked collection curated specifically for you.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Reuse the ProductList Catalog, locked to this Department ID */}
            <ProductList departmentId={departmentId} />
        </div>
    );
}

export default DepartmentPage;
