import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, CATEGORY_API_PARAMS } from "../data/products.js";

const PRIORITY_KEYS = ["data", "produtos", "products", "items", "result", "lista"];
const DEFAULT_ERROR_MESSAGE = "Nao foi possivel carregar os produtos no momento.";

const normalizeSizes = (sizes) => {
  if (!sizes) {
    return [];
  }

  if (typeof sizes === "string" || typeof sizes === "number") {
    return [String(sizes)];
  }

  let values;
  if (Array.isArray(sizes)) {
    values = sizes;
  } else if (typeof sizes === "object") {
    values = Object.values(sizes);
  } else {
    return [];
  }

  return values
    .map((size) => {
      if (!size) {
        return null;
      }
      if (typeof size === "string" || typeof size === "number") {
        return String(size);
      }
      if (typeof size === "object") {
        return (
          size.sigla ??
          size.nome ??
          size.label ??
          size.tamanho ??
          size.valor ??
          size.descricao ??
          null
        );
      }
      return null;
    })
    .filter(Boolean);
};

const extractProductsFromPayload = (payload, categoryKeys, categoryKeysLower) => {
  if (!payload) {
    return [];
  }

  const inspectObject = (value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (value && typeof value === "object") {
      for (const key of Object.keys(value)) {
        if (categoryKeysLower.has(key.toLowerCase())) {
          const candidate = value[key];
          if (Array.isArray(candidate)) {
            return candidate;
          }
        }
      }
    }

    return null;
  };

  if (Array.isArray(payload)) {
    return payload;
  }

  if (typeof payload === "object") {
    for (const key of PRIORITY_KEYS) {
      if (key in payload) {
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

    const arraysInObject = Object.values(payload).find((value) => Array.isArray(value));
    if (arraysInObject) {
      return arraysInObject;
    }
  }

  return [];
};

const normalizeProduct = (rawProduct, index, categoryKeysLower) => {
  if (!rawProduct || typeof rawProduct !== "object") {
    return null;
  }

  const productCategory =
    rawProduct.category ??
    rawProduct.categoria ??
    rawProduct.categorySlug ??
    rawProduct.slugCategoria ??
    rawProduct.tipo;

  if (
    productCategory &&
    !categoryKeysLower.has(String(productCategory).toLowerCase())
  ) {
    return null;
  }

  const productId =
    rawProduct.id ??
    rawProduct._id ??
    rawProduct.codigo ??
    rawProduct.sku ??
    `produto-${index}`;

  const rawName =
    rawProduct.name ?? rawProduct.nome ?? rawProduct.titulo ?? rawProduct.title;
  const productName = rawName ? String(rawName) : `Produto ${index + 1}`;

  const rawPrice =
    rawProduct.price ??
    rawProduct.preco ??
    rawProduct.valor ??
    rawProduct.amount ??
    rawProduct.precoAtual;
  const parsedPrice =
    typeof rawPrice === "number"
      ? rawPrice
      : parseFloat(String(rawPrice ?? "").replace(",", "."));
  const productPrice = Number.isFinite(parsedPrice) ? parsedPrice : 0;

  const productImage =
    rawProduct.image ??
    rawProduct.imagem ??
    rawProduct.imagemUrl ??
    rawProduct.imageUrl ??
    rawProduct.urlImagem ??
    rawProduct.foto ??
    rawProduct.thumbnail ??
    "";

  const productDescription =
    rawProduct.description ??
    rawProduct.descricao ??
    rawProduct.detalhes ??
    rawProduct.resumo ??
    rawProduct.subtitle ??
    null;

  const productSizes = normalizeSizes(
    rawProduct.sizes ??
      rawProduct.tamanhos ??
      rawProduct.variacoes ??
      rawProduct.estoques
  );

  // Normalize reviews/avaliacoes from various possible API shapes
  const pickReviewsSource = () => {
    if (Array.isArray(rawProduct.reviews)) return rawProduct.reviews;
    if (Array.isArray(rawProduct.avaliacoes)) return rawProduct.avaliacoes;
    if (Array.isArray(rawProduct.avaliacao)) return rawProduct.avaliacao;
    if (Array.isArray(rawProduct.opinioes)) return rawProduct.opinioes;
    if (Array.isArray(rawProduct.comentarios)) return rawProduct.comentarios;
    // Object container case
    const objCandidate =
      (rawProduct.reviews && typeof rawProduct.reviews === "object") ? rawProduct.reviews :
      (rawProduct.avaliacoes && typeof rawProduct.avaliacoes === "object") ? rawProduct.avaliacoes :
      (rawProduct.avaliacao && typeof rawProduct.avaliacao === "object") ? rawProduct.avaliacao :
      (rawProduct.opinioes && typeof rawProduct.opinioes === "object") ? rawProduct.opinioes :
      (rawProduct.comentarios && typeof rawProduct.comentarios === "object") ? rawProduct.comentarios :
      null;
    if (objCandidate) {
      try {
        return Object.values(objCandidate);
      } catch (_) {
        return [];
      }
    }
    // Single primitive/comment string
    if (typeof rawProduct.reviews === "string") return [rawProduct.reviews];
    if (typeof rawProduct.avaliacoes === "string") return [rawProduct.avaliacoes];
    if (typeof rawProduct.avaliacao === "string") return [rawProduct.avaliacao];
    if (typeof rawProduct.opinioes === "string") return [rawProduct.opinioes];
    if (typeof rawProduct.comentarios === "string") return [rawProduct.comentarios];
    return [];
  };

  const normalizeSingleReview = (raw, idx) => {
    if (!raw) return null;
    if (typeof raw === "string" || typeof raw === "number") {
      return {
        id: `review-${index}-${idx}`,
        rating: 5,
        comment: String(raw),
      };
    }
    if (typeof raw === "object") {
      const id = String(raw.id ?? raw._id ?? `review-${index}-${idx}`);
      const ratingRaw =
        raw.rating ?? raw.nota ?? raw.estrelas ?? raw.stars ?? raw.rate ?? raw.avaliacao;
      const commentRaw =
        raw.comment ?? raw.comentario ?? raw.coment ?? raw.text ?? raw.texto ?? raw.descricao ?? raw.review;
      const ratingNum = Number(ratingRaw);
      const rating = Number.isFinite(ratingNum)
        ? Math.max(1, Math.min(5, Math.round(ratingNum)))
        : 5;
      return {
        id,
        rating,
        comment: commentRaw ? String(commentRaw) : "",
      };
    }
    return null;
  };

  const productReviews = pickReviewsSource()
    .map((r, i) => normalizeSingleReview(r, i))
    .filter(Boolean);

  return {
    ...rawProduct,
    id: String(productId),
    name: productName,
    price: productPrice,
    image: productImage,
    description: productDescription ?? undefined,
    sizes: Array.isArray(productSizes) ? productSizes : [],
    reviews: productReviews,
  };
};

export function useCategoryProducts(slug) {
  const slugValue = slug ?? "";
  const slugLower = slugValue.toLowerCase();
  const categoryParam = CATEGORY_API_PARAMS[slugLower] ?? slugLower;

  const { categoryKeys, categoryKeysLower } = useMemo(() => {
    const keysSet = new Set();
    if (slugValue) {
      keysSet.add(slugValue);
      keysSet.add(slugLower);
    }
    if (categoryParam) {
      keysSet.add(categoryParam);
      keysSet.add(categoryParam.toLowerCase());
    }
    const keys = Array.from(keysSet).filter(Boolean);
    const lower = new Set(keys.map((key) => String(key).toLowerCase()));
    return { categoryKeys: keys, categoryKeysLower: lower };
  }, [slugValue, slugLower, categoryParam]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(Boolean(slugValue));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slugLower) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    const endpoint = `${API_BASE_URL}/produtos/categoria/${encodeURIComponent(categoryParam)}`;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar produtos: status ${response.status}`);
        }

        const payload = await response.json();
        const rawProducts = extractProductsFromPayload(
          payload,
          categoryKeys,
          categoryKeysLower
        );

        const normalized = rawProducts
          .map((raw, index) => normalizeProduct(raw, index, categoryKeysLower))
          .filter(Boolean);

        if (!isActive) {
          return;
        }

        setProducts(normalized);
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        console.error(`[useCategoryProducts] Falha ao carregar produtos (${slugValue})`, err);
        if (isActive) {
          setProducts([]);
          setError(DEFAULT_ERROR_MESSAGE);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [categoryKeys, categoryKeysLower, categoryParam, slugLower, slugValue]);

  return { products, loading, error };
}
