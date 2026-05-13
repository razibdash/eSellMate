"use client";

import { useEffect, useMemo, useState } from "react";
import type { CartItem, StorefrontProduct } from "@/types/storefront";
import { getStorefrontCartKey } from "@/lib/storefront";

export function useStorefrontCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartKey, setCartKey] = useState("shopbot_storefront_cart");

  useEffect(() => {
    setCartKey(getStorefrontCartKey());
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(cartKey);
      if (raw) {
        setItems(JSON.parse(raw) as CartItem[]);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  }, [cartKey]);

  useEffect(() => {
    window.localStorage.setItem(cartKey, JSON.stringify(items));
  }, [cartKey, items]);

  const totals = useMemo(() => {
    const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    return { quantity, subtotal };
  }, [items]);

  function addItem(product: StorefrontProduct, quantity = 1) {
    setItems((current) => {
      const existing = current.find((item) => item.product_id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product_id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  item.stock_quantity || item.quantity + quantity,
                ),
              }
            : item,
        );
      }

      return [
        ...current,
        {
          product_id: product.id,
          slug: product.slug,
          name: product.name,
          price: Number(product.discount_price || product.price),
          image: product.image || null,
          quantity,
          stock_quantity: product.stock_quantity,
        },
      ];
    });
  }

  function updateQuantity(productId: CartItem["product_id"], quantity: number) {
    setItems((current) =>
      current
        .map((item) =>
          item.product_id === productId
            ? {
                ...item,
                quantity: Math.max(1, Math.min(quantity, item.stock_quantity)),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(productId: CartItem["product_id"]) {
    setItems((current) => current.filter((item) => item.product_id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  return {
    items,
    totals,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
