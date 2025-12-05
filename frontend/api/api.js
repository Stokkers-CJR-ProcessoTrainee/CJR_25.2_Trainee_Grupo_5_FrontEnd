import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stokkers.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function login(email, password) {
  const res = await api.post('/login', { email, password });
  return res.data;
}

export async function register(name, username, email, password_hash) {
  const res = await api.post('user/register', { name, username, email, password_hash });
  return res.data;
}

export async function getUserById(id) {
  const res = await api.get(`/user/${id}`);
  return res.data;
}

export async function getProductsByUser(id) {
  const res = await api.get(`/user/${id}/products`);
  return res.data;
}

export async function getStoresByUser(id) {
  const res = await api.get(`/user/${id}/stores`);
  return res.data;
}

export async function getUserRatings(id) {
  const res = await api.get(`/user/${id}/ratings`);
  return res.data;
}

export async function forgotPassword(email) {
  const res = await api.post('/login/forgot', { email });
  return res.data;
}

export async function verifyCode(email, code) {
  const res = await api.post('/login/verify', { email, code });
  return res.data;
}

export async function resetPassword(userId, newPassword) {
  const res = await api.post('/login/reset', { userId, newPassword });
  return res.data;
}

export async function updateData(data) {
  const token = localStorage.getItem('token');
  const res = await api.patch('/user/update', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function updatePassword(data) {
  const token = localStorage.getItem('token');
  const res = await api.patch('/user/update-pass', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function deleteUser() {
  const token = localStorage.getItem('token');
  const res = await api.delete('/user/delete', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getProductsById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

export async function getCategories() {
  const res = await api.get('/categories');
  return res.data;
}

export async function getProductsByCategory(categoryId) {
  const res = await api.get(`/products/category/${categoryId}`);
  return res.data;
}

export async function getStores() {
  const res = await api.get('/stores');
  return res.data;
}

export async function getProductImages(productId) {
  const res = await api.get(`/products-images/product/${productId}`);
  return res.data;
}

export async function getCategoryById(categoryId) {
  const res = await api.get(`/categories/${Number(categoryId)}`);
  return res.data;
}

export async function createStore(data) {
  const token = localStorage.getItem("token");

  const res = await api.post("/stores", data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function updateStore(id, data) {
  const token = localStorage.getItem("token");

  const res = await api.put(`/stores/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function deleteStore(id) {
  const token = localStorage.getItem("token");

  const res = await api.delete(`/stores/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  return res.data;
}

export async function addProductComment(ratingId, data) {
  const token = localStorage.getItem('token');
  const res = await api.post(`/comments/product-rating/${ratingId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function addStoreComment(ratingId, data) {
  const token = localStorage.getItem('token');
  const res = await api.post(`/comments/store-rating/${ratingId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getStoreComment(ratingId) {
  const token = localStorage.getItem('token');
  const res = await api.get(`/comments/store-rating/${ratingId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getProductComment(ratingId) {
  const token = localStorage.getItem('token');
  const res = await api.get(`/comments/product-rating/${ratingId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getStoreRating(ratingId) {
  const token = localStorage.getItem('token');
  const res = await api.get(`/store-ratings/${ratingId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getProductRating(ratingId) {
  const token = localStorage.getItem('token');
  const res = await api.get(`/product-ratings/${ratingId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function updateStoreComment(id, data, ratingId) {
  const token = localStorage.getItem('token');
  const res = await api.patch(`/comments/store-rating/${ratingId}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function updateProductComment(id, data, ratingId) {
  const token = localStorage.getItem('token');
  const res = await api.patch(`/comments/product-rating/${ratingId}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function deleteStoreComment(id, ratingId) {
  const token = localStorage.getItem('token');
  const res = await api.delete(`/comments/store-rating/${ratingId}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function deleteProductComment(id, ratingId) {
  const token = localStorage.getItem('token');
  const res = await api.delete(`/comments/product-rating/${ratingId}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getStoreById(id) {
  const res = await api.get(`/stores/${id}`);
  return res.data
}

export async function getProductsByStore(storeId) {
  const res = await api.get(`/products/store/${storeId}`);
  return res.data
}

export async function getStoreRatingByStore(storeId) {
  const res = await api.get(`/store-ratings/store/${storeId}`);
  return res.data
}

export async function getAllParentCategories() {
  const res = await api.get('/categories/parents');
  return res.data;
}

export async function createProduct(storeId, data) {
  const token = localStorage.getItem('token');
  const res = await api.post(`/products/store/${storeId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function deleteProduct(id) {
  const token = localStorage.getItem('token');
  const res = await api.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function updateProduct(id, data) {
  const token = localStorage.getItem('token');
  const res = await api.patch(`/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export async function getProductByCategory(categoryId) {
  const res = await api.get(`/products/category/${categoryId}`);
  return res.data
}

export async function createStoreRating(storeId, data) {
  const token = localStorage.getItem('token');
  const res = await api.post(`/store-ratings/store/${storeId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export async function updateStoreRating(ratingId, data) {
  const token = localStorage.getItem('token');
  const res = await api.patch(`/store-ratings/${ratingId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export async function createProductRating(productId, data) {
  const token = localStorage.getItem('token');
  const res = await api.post(`/product-ratings/product/${productId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export async function updateProductRating(ratingId, data) {
  const token = localStorage.getItem('token');
  const res = await api.patch(`/product-ratings/${ratingId}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data
};

export async function getProductById(productId) {
  return api.get(`/products/${productId}`);
}

export async function deleteProductRating(ratingId) {
  const token = localStorage.getItem('token');
  const res = await api.delete(`/product-ratings/${ratingId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function deleteStoreRating(ratingId) {
  const token = localStorage.getItem('token');
  const res = await api.delete(`/store-ratings/${ratingId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function getChildCategories(parentCategoryId) {
  const res = await api.get(`/categories/children/${parentCategoryId}`);
  return res.data;
}

export async function deleteImage(imageId) {
  const token = localStorage.getItem('token');
  const res = await api.delete(`/products-images/${imageId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}





