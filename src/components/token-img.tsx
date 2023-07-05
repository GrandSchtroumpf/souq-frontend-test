import { component$ } from "@builder.io/qwik";
import type { CollectionToken } from "~/models";
import { viewTransition } from "./view-transition";

interface TokenImgProps {
  width: number;
  token: CollectionToken;
  eager?: boolean;
  class?: string;
  id?: string;
}
const sizes = [50, 150, 300, 450];

export const TokenImg = component$(({width, token, eager, ...props}: TokenImgProps) => {
  const src = `img/${token.id}/original.webp`;
  const srcset = sizes.map(size => `/img/${token.id}/${size}w.webp ${size}w`).join(', ');
  const height = 9/6 * width;
  const optimization = {
    decoding: eager ? 'sync' : 'async',
    fetchpriority: eager ? 'high' : 'low',
    loading: eager ? 'eager' : 'lazy',
  } as const;

  return <img
    title={token.metadata.name}
    style={viewTransition(token.id)}
    src={src}
    width={width}
    height={height}
    srcSet={srcset}
    alt={token.metadata.name}
    {...optimization}
    {...props}
  />;
})
