declare module "react-katex" {
  import type { ComponentType } from "react";

  type Settings = Record<string, unknown>;

  export interface KatexProps {
    children?: string;
    math?: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
    settings?: Settings;
    as?: keyof JSX.IntrinsicElements | ComponentType<unknown>;
  }

  export const InlineMath: ComponentType<KatexProps>;
  export const BlockMath: ComponentType<KatexProps>;
}
