import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { categories, productsByCategory } from "../data/products.js";
import { useCart } from "../contexts/CartContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import ProductDetailModal from "../components/ProductDetailModal.jsx";
import "../styles/categoryLegacy.css";

function CategoryLegacy({ slug }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [defaultAction, setDefaultAction] = useState("buy");
  const [products, setProducts] = useState(() => productsByCategory[slug] ?? []);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);

  const category = useMemo(() => categories.find((item) => item.slug === slug), [slug]);
  const fallbackProducts = useMemo(() => productsByCategory[slug] ?? [], [slug]);
  const fallbackProductsMap = useMemo(() => {
    const map = new Map();
    fallbackProducts.forEach((product) => {
      map.set(product.id, product);
    });
    return map;
  }, [fallbackProducts]);
  const fallbackSizes = useMemo(() => {
    for (const product of fallbackProducts) {
      if (Array.isArray(product.sizes) && product.sizes.length > 0) {
        return product.sizes;
      }
    }
    return [];
  }, [fallbackProducts]);

  useEffect(() => {
    setProducts(fallbackProducts);
  }, [fallbackProducts]);

  const extractProductsFromPayload = useMemo(
    () => (payload) => {
      if (!payload) {
        return [];
      }

      const inspectObject = (value) => {
        if (Array.isArray(value)) {
          return value;
        }
        if (value && typeof value === "object") {
          const directMatch = value[slug];
          if (Array.isArray(directMatch)) {
            return directMatch;
          }
          const normalizedKey = Object.keys(value).find((key) => key.toLowerCase() === slug);
          if (normalizedKey && Array.isArray(value[normalizedKey])) {
            return value[normalizedKey];
          }
        }
        return null;
      };

      if (Array.isArray(payload)) {
        return payload;
      }

      if (typeof payload === "object") {
        const prioritizedKeys = [
          "data",
          "produtos",
          "products",
          "items",
          "result",
          "lista",
        ];

        for (const key of prioritizedKeys) {
          if (payload[key]) {
            const inspected = inspectObject(payload[key]);
            if (inspected) {
              return inspected;
            }
          }
        }

        const inspected = inspectObject(payload);
        if (inspected) {
          return inspected;
        }
      }

      return [];
    },
    [slug]
  );

  const normalizeProduct = useMemo(
    () => (rawProduct, index) => {
      if (!rawProduct || typeof rawProduct !== "object") {
        return null;
      }

      const productCategory =
        rawProduct.category ??
        rawProduct.categoria ??
        rawProduct.categorySlug ??
        rawProduct.slugCategoria ??
        rawProduct.tipo;

      if (productCategory && String(productCategory).toLowerCase() !== slug) {
        return null;
      }

      const fallbackById =
        (rawProduct.id && fallbackProductsMap.get(rawProduct.id)) ||
        (rawProduct._id && fallbackProductsMap.get(rawProduct._id)) ||
        (rawProduct.codigo && fallbackProductsMap.get(rawProduct.codigo)) ||
        (rawProduct.sku && fallbackProductsMap.get(rawProduct.sku)) ||
        null;

      const productId =
        rawProduct.id ??
        rawProduct._id ??
        rawProduct.codigo ??
        rawProduct.sku ??
        fallbackById?.id ??
        `produto-${slug}-${index}`;

      const rawName = rawProduct.name ?? rawProduct.nome ?? rawProduct.titulo ?? rawProduct.title;
      const productName = rawName ?? fallbackById?.name ?? "Produto";

      const rawPrice = rawProduct.price ?? rawProduct.preco ?? rawProduct.valor ?? rawProduct.amount;
      const parsedPrice =
        typeof rawPrice === "number" ? rawPrice : parseFloat(String(rawPrice ?? ""));
      const productPrice = Number.isFinite(parsedPrice)
        ? parsedPrice
        : fallbackById?.price ?? 0;

      const productImage =
        rawProduct.image ??
        rawProduct.imagem ??
        rawProduct.imagemUrl ??
        rawProduct.imageUrl ??
        rawProduct.urlImagem ??
        rawProduct.foto ??
        fallbackById?.image ??
        "";

      const productDescription =
        rawProduct.description ??
        rawProduct.descricao ??
        rawProduct.detalhes ??
        fallbackById?.description ??
        null;

      const normalizeSizes = (sizes) => {
        if (!sizes) {
          return null;
        }
        if (Array.isArray(sizes)) {
          return sizes
            .map((size) =>
              typeof size === "string"
                ? size
                : size?.name ?? size?.nome ?? size?.label ?? size?.descricao ?? null
            )
            .filter(Boolean);
        }
        return null;
      };

      const resolvedSizes =
        normalizeSizes(rawProduct.sizes) ??
        normalizeSizes(rawProduct.tamanhos) ??
        normalizeSizes(rawProduct.variacoes) ??
        normalizeSizes(rawProduct.estoques) ??
        fallbackById?.sizes ??
        fallbackSizes;

      return {
        ...fallbackById,
        ...rawProduct,
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        description: productDescription ?? undefined,
        sizes: Array.isArray(resolvedSizes) ? resolvedSizes : [],
      };
    },
    [fallbackProductsMap, fallbackSizes, slug]
  );

  useEffect(() => {
    if (!category) {
      setProducts([]);
      return;
    }

    let isActive = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoadingProducts(true);
      setProductsError(null);

      try {
        const endpoint = `/api/produtos/categoria/${encodeURIComponent(slug)}`;
        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar produtos (status ${response.status})`);
        }

        const payload = await response.json();
        const remoteProducts = extractProductsFromPayload(payload)
          .map((raw, index) => normalizeProduct(raw, index))
          .filter(Boolean);

        if (!isActive) {
          return;
        }

        if (remoteProducts.length > 0) {
          setProducts(remoteProducts);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        console.error(`[CategoryLegacy] Falha ao buscar produtos em /api/produtos`, error);
        if (isActive) {
          setProductsError("Nao foi possivel carregar os produtos atualizados. Exibindo itens padrao.");
          setProducts(fallbackProducts);
        }
      } finally {
        if (isActive) {
          setLoadingProducts(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [category, extractProductsFromPayload, fallbackProducts, normalizeProduct]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }
    const updatedProduct = products.find((product) => product.id === selectedProduct.id);
    if (updatedProduct && updatedProduct !== selectedProduct) {
      setSelectedProduct(updatedProduct);
    }
  }, [products, selectedProduct]);

  useEffect(() => {
    if (!selectedProduct || !selectedSize) {
      return;
    }
    if (!Array.isArray(selectedProduct.sizes) || !selectedProduct.sizes.includes(selectedSize)) {
      setSelectedSize(null);
    }
  }, [selectedProduct, selectedSize]);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const requiresSize = selectedProduct?.sizes && selectedProduct.sizes.length > 0;

  const openModal = (product, action = "buy") => {
    setSelectedProduct(product);
    setSelectedSize(null);
    setDefaultAction(action);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedSize(null);
    setDefaultAction("buy");
  };

  const handleAddToCart = () => {
    if (!selectedProduct || (requiresSize && !selectedSize)) {
      return;
    }
    addItem(selectedProduct, selectedSize || null);
    closeModal();
  };

  const handleBuyNow = () => {
    if (!selectedProduct || (requiresSize && !selectedSize)) {
      return;
    }
    addItem(selectedProduct, selectedSize || null);
    closeModal();
    navigate("/checkout");
  };

  return (
    <div className="category-legacy-page">
      <section className="category-legacy-page__hero">
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </section>

      <section className="category-legacy-page__grid">
        {loadingProducts && (
          <p className="category-legacy-page__status" aria-live="polite">
            Carregando produtos...
          </p>
        )}
        {!loadingProducts && products.length === 0 && (
          <p className="category-legacy-page__status" aria-live="polite">
            Nenhum produto disponivel no momento.
          </p>
        )}
        {products.map((product) => (
          <article
            key={product.id}
            className="legacy-product-card"
            role="presentation"
            onClick={() => openModal(product, "buy")}
          >
            <img src={product.image} alt={product.name} loading="lazy" />
            <h2>{product.name}</h2>
            <p className="legacy-product-card__price">{formatCurrency(product.price)}</p>
          </article>
        ))}
      </section>

      <ProductDetailModal
        product={selectedProduct}
        open={Boolean(selectedProduct)}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onClose={closeModal}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        defaultAction={defaultAction}
      />
      {productsError && (
        <div className="category-legacy-page__status category-legacy-page__status--error" role="status">
          {productsError}
        </div>
      )}
    </div>
  );
}

export default CategoryLegacy;
